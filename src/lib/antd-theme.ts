import type { ThemeConfig } from 'antd';

export const familyTheme: ThemeConfig = {
  token: {
    colorPrimary: '#4CAF82',
    colorSuccess: '#4CAF82',
    colorInfo: '#38B2AC',
    colorWarning: '#F9A8C9',
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F8FFFE',
    colorTextBase: '#1A2E25',
    colorTextSecondary: '#6B8F7A',
    colorBorder: '#E2EDE8',
    colorBorderSecondary: '#F0F7F4',
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
  },
  components: {
    Button: {
      colorPrimary: '#4CAF82',
      colorPrimaryHover: '#2E7D5E',
      borderRadius: 10,
      controlHeight: 40,
    },
    Card: {
      colorBorderSecondary: '#E2EDE8',
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(76, 175, 130, 0.08)',
    },
    Menu: {
      itemSelectedBg: '#E8F5EF',
      itemSelectedColor: '#2E7D5E',
      itemHoverBg: '#F8FFFE',
    },
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
    },
    Tag: {
      colorSuccess: '#4CAF82',
      colorSuccessBg: '#E8F5EF',
      colorInfo: '#38B2AC',
      colorInfoBg: '#E6FFFA',
    },
  },
};
