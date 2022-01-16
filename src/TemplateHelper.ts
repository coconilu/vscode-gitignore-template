import axios, { AxiosRequestConfig } from 'axios';

class TemplateHelper {
  templateMenu: string[] = [];
  templates: Record<string, string> = {};

  constructor() {
    console.log('TemplateHelper Init');
  }

  getTemplateMenu = async () => {
    const config: AxiosRequestConfig<string[]> = {
      method: 'GET',
      url: 'https://api.github.com/gitignore/templates',
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    };

    try {
      if (this.templateMenu.length > 0) {
        return this.templateMenu;
      }
      const menuRes = await axios(config);
      this.templateMenu = menuRes.data;
      return this.templateMenu;
    } catch (error) {
      console.error(' TemplateHelper ~ updateTemplateMenu= ~ error', error);
      return this.templateMenu;
    }
  };

  getTemplate = async (name: string) => {
    const config: AxiosRequestConfig<{ name: string; source: string }> = {
      method: 'GET',
      url: `https://api.github.com/gitignore/templates/${name}`,
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    };

    try {
      if (this.templates[name]) {
        return this.templates[name];
      }
      const templateRes = await axios(config);
      this.templates[name] = templateRes.data.source;
      return this.templates[name];
    } catch (error) {
      console.error('TemplateHelper ~ getTemplate= ~ error', error);
      return '';
    }
  };
}

export default new TemplateHelper();
