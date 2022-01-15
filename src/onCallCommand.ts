import { TextEncoder } from 'util';
import * as vscode from 'vscode';
import TemplateHelper from './TemplateHelper';

/**
 * 1. 获取所有 workspace
 * 2. 如果多于一个则让用户选择一个project，否则帮用户选择唯一的一个
 * 3. 根据选择的 project 拼接 .gitignore 文件，得到 uri
 * 4. 获取 github 的所有 ignore 模板
 * 5. 询问用户使用哪个模板
 * 6. 新建或覆盖 .gitignore 文件内容
 */
export default async () => {
  // The code you place here will be executed every time your command is executed
  const workSpaceNames =
    vscode.workspace.workspaceFolders?.map((workSpace) => workSpace.name) || [];

  if (workSpaceNames.length === 0) {return;}

  let projectName = '';
  if (workSpaceNames.length === 1) {
    projectName = workSpaceNames[0];
  }
  // multi project
  else {
    projectName =
      (await vscode.window.showQuickPick(workSpaceNames, {
        placeHolder: 'choose project in workspace',
      })) || '';
  }

  if (!projectName) {return;}

  const projectUri = vscode.workspace.workspaceFolders?.find(
    (workSpace) => workSpace.name === projectName,
  );

  if (!projectUri) {return;}

  const projectGitIgnoreUri = vscode.Uri.joinPath(
    projectUri.uri,
    './.gitignore',
  );

  const templateMenu = await TemplateHelper.getTemplateMenu();
  const templateName = await vscode.window.showQuickPick(templateMenu, {
    placeHolder: templateMenu.slice(0, 3).join(', ') + ', etc.',
  });

  if (!templateName) {return;}

  const templateContent = await TemplateHelper.getTemplate(templateName);
  try {
    vscode.workspace.fs.writeFile(
      projectGitIgnoreUri,
      new TextEncoder().encode(templateContent),
    );
  } catch (error) {
    console.log('write file error happen', error);
  }
};
