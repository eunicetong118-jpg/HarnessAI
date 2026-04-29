export const IB_MAPPING = [
  {
    countryCode: 'ID',
    countryName: 'Indonesia',
    ibUrl: 'https://mms.harnessforex.com/en/register?ib=888001',
  },
  {
    countryCode: 'MY',
    countryName: 'Malaysia',
    ibUrl: 'https://mms.harnessforex.com/en/register?ib=888002',
  },
  {
    countryCode: 'SG',
    countryName: 'Singapore',
    ibUrl: 'https://mms.harnessforex.com/en/register?ib=888003',
  },
];

export type IBConfig = (typeof IB_MAPPING)[number];
