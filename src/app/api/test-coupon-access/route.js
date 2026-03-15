export async function GET(req) {
  const code = 'CHARM6M76T4';
  const isSpinPage = false;

  const apiUrl = isSpinPage
    ? `${process.env.CMSURL}api/spin-coupons?filters[code][$eq]=${code}`
    : `${process.env.CMSURL}api/coupons?filters[code][$eq]=${code}`;

  console.log('CMSURL:', process.env.CMSURL);
  console.log('Full API URL:', apiUrl);

  try {
    const res = await fetch(apiUrl, {
      cache: "no-store",
    });

    const result = await res.json();

    return Response.json({
      status: res.status,
      cmsUrl: process.env.CMSURL,
      fullUrl: apiUrl,
      result: result
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      cmsUrl: process.env.CMSURL,
      fullUrl: apiUrl
    }, { status: 500 });
  }
}
