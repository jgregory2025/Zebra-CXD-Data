// src/services/sharepoint.js
const SITE_URL = "https://zebra.sharepoint.com/sites/CXDProjectVitals";
export async function getListItems(listName) {
 const res = await fetch(
   `${SITE_URL}/_api/web/lists/getbytitle('${listName}')/items`,
   {
     method: "GET",
     headers: { Accept: "application/json;odata=verbose" },
     //credentials: "include",
   }
 );
 if (!res.ok) {
   console.error("Error fetching list", listName, res.status);
   return [];
 }
 const data = await res.json();
 return data.d.results;
}