const { createClient } = require("@urql/core");
const fetch = require("cross-fetch");

function gql({ url, headers }) {
  return createClient({
    url,
    fetch,
    maskTypename: true,
    fetchOptions: {
      headers: {
        "Content-Type": "application/json",
        ...(headers || {})
      }
    }
  });
}

const urql = async ({ url, headers, mutation, query }) => {
  if (mutation) {
    return gql({
      url,
      headers
    })
      .mutation(mutation.template, mutation.binding)
      .toPromise();
  }

  return gql({
    url,
    headers
  })
    .query(query.template, query.binding)
    .toPromise();
};

module.exports = urql;
