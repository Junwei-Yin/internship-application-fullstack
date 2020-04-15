addEventListener('fetch', event => {
  console.log(event);
  event.respondWith(handleRequest(event.request))
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
  /** Fetch variants url */
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  let data = await response.json();
  const variants = data.variants;

  /** First time to pick a random variant */
  if(!request.headers.has('Cookie')) {
    console.log('First time for random');
    let random = Math.round(Math.random());
    console.log(random);

    let res = await fetch(variants[random]);
    let temp = await res.text();
    temp = changeElements(temp);

    return new Response(temp, {
      headers: {'content-type': 'text/html', 'Set-Cookie': random},
    });
  }

  /** Already pick a random variant, return certain site */
  else {
    console.log('Return certain site according to cookie');
    let index = request.headers.get('Cookie');
    console.log(index.charAt(index.length - 1));
    index = parseInt(index.charAt(index.length - 1));

    let res = await fetch(variants[index]);

    let temp = await res.text();
    temp = changeElements(temp);

    return new Response(temp, {
      headers: {'content-type': 'text/html'},
    });
  }

}

/** Helper function for editer HTML elements */
function changeElements(html) {
  html = html.replace(/Variant/g, 'Changed Variant');
  html = html.replace(/variant/, 'changed variant');
  html = html.replace(/take home project/, 'online assessment');
  html = html.replace(/Return to cloudflare.com/, 'Welcome to ESN web application (may take a while to load the page)');
  html = html.replace(/cloudflare.com/, 'f19-esn-sa5.herokuapp.com/');
  return html;
}
