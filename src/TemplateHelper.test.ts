import * as assert from 'assert';

import TemplateHelper from './TemplateHelper';

suite('TemplateHelper', () => {
  const testTemplate = 'Node';

  test('TemplateHelper getTemplateMenu', async () => {
    const menu = await TemplateHelper.getTemplateMenu();
    assert.strictEqual(
      true,
      menu.includes(testTemplate),
      `menu not include {{${testTemplate}}}`,
    );
  });

  test('TemplateHelper getTemplate', async () => {
    const template = await TemplateHelper.getTemplate(testTemplate);
    assert.strictEqual(
      true,
      template.length > 0,
      `{{${testTemplate}}} template content is empty`,
    );
  });
});
