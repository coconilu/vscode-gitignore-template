import { TextEncoder } from 'util';
import * as vscode from 'vscode';
import TemplateHelper from '@/TemplateHelper';

/**
 * 1. 如果是右键点击.gitignore，那么uri是存在的，跳到 5；如果是从命令行执行的，则uri是undefined，逻辑顺序往下
 * 2. 获取所有 workspace
 * 3. 如果多于一个则让用户选择一个project，否则帮用户选择唯一的一个
 * 4. 根据选择的 project 拼接 .gitignore 文件，得到 uri
 * 5. 获取 github 的所有 gitignore 模板
 * 6. 询问用户使用哪个模板
 * 7. 新建或覆盖 .gitignore 文件内容
 */
export default async (uri: vscode.Uri) => {
  // .gitignore 文件的 uri
  let projectGitIgnoreUri = uri;

  if (!uri) {
    const workSpaceNames =
      vscode.workspace.workspaceFolders?.map((workSpace) => workSpace.name) ||
      [];

    if (workSpaceNames.length === 0) {
      return;
    }

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

    if (!projectName) {
      return;
    }

    const projectUri = vscode.workspace.workspaceFolders?.find(
      (workSpace) => workSpace.name === projectName,
    );

    if (!projectUri) {
      return;
    }

    projectGitIgnoreUri = vscode.Uri.joinPath(projectUri.uri, './.gitignore');
  }

  let templateMenu: string[] = [];
  try {
    templateMenu = await TemplateHelper.getTemplateMenu();
  } catch (error) {
    await vscode.window.showErrorMessage('Get template list failed!');
  }
  if (templateMenu.length === 0) {
    return;
  }

  const templateName = await vscode.window.showQuickPick(templateMenu, {
    placeHolder: templateMenu.slice(0, 3).join(', ') + ', etc.',
  });

  if (!templateName) {
    return;
  }

  let templateContent = '';
  try {
    templateContent = await TemplateHelper.getTemplate(templateName);
  } catch (error) {
    await vscode.window.showErrorMessage(
      `Get ${templateName} template failed!`,
    );
  }
  if (!templateContent) {
    return;
  }

  try {
    await vscode.workspace.fs.writeFile(
      projectGitIgnoreUri,
      new TextEncoder().encode(templateContent),
    );
    await vscode.window.showInformationMessage(
      `{{${templateName}}} gitignore template has written to ${projectGitIgnoreUri.path}`,
    );
  } catch (error) {
    console.log('write file error happen', error);
    await vscode.window.showErrorMessage('Write .gitignore file failed!');
  }
};
