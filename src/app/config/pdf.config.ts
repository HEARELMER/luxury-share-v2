const year = new Date().getFullYear();
export const pdfConfig: any = {
  branding: {
    companyName: '20605053913 - AYACUCHO LUXURY TRAVEL S.R.L',
    logo: './images/logo.png',
    primaryColor: [255, 35, 35],
    secondaryColor: [0, 0, 0],
    textColor: [0, 0, 0],
  },
  metadata: {
    author: '20605053913 - AYACUCHO LUXURY TRAVEL S.R.L',
    creator: '20605053913 - AYACUCHO LUXURY TRAVEL S.R.L',
  },
  fonts: {
    default: 'helvetica',
    titleSize: 16,
    subtitleSize: 14,
    normalSize: 12,
    smallSize: 10,
  },
  tables: {
    theme: 'striped',
    headerColors: {
      fill: [255, 240, 240],
      text: [255, 35, 35],
    },
    alternateRowColors: [
      [249, 249, 250],
      [255, 255, 255],
    ],
  },
  footer: {
    includePageNumbers: true,
    pageNumberFormat: ' {0} de {1}',
    text: `© AYACUCHO LUXURY TRAVEL S.R.L - ${year}`,
  },
};
