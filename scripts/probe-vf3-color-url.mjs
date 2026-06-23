const base =
  "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/vi_VN/v1782192340582/ldp-all-cars/360/VF3/exterior/181U/";
const names = ["F0.png", "f0.png", "01.png", "1.png", "frame-0.png", "image-0.png", "0.png", "F1.png", "F01.png"];
for (const n of names) {
  const r = await fetch(base + n, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } });
  console.log(n, r.status);
}
// try reserves static
const reserves = [
  "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwf22e2e6c/reserves/VF3/exterior/181U.png",
  "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwf22e2e6c/reserves/VF3/181U.png",
  "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwf22e2e6c/reserves/VF3/Summer-Yellow.png",
];
for (const u of reserves) {
  const r = await fetch(u, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } });
  console.log(u.split("/").slice(-2).join("/"), r.status);
}
