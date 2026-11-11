/* ==========================================================================
   FoRB violation data — EDIT THIS FILE to update the figures on the Home page
   (number row) and the About page (#data: stats, townships and yearly charts).

   !!! ALL NUMBERS BELOW ARE PLACEHOLDERS !!!
   The client has not supplied figures yet. Replace every value with the
   Network's verified documentation data before the site goes live, then set
   `isPlaceholder` to false to hide the yellow "Sample data" flags.
   ========================================================================== */

window.FORB_DATA = {
  isPlaceholder: true,
  lastUpdated: "— (to be confirmed)",

  // Headline figures (the three "Data + Icon" boxes)
  headline: {
    leadersKilled: 0,          // Religious leaders killed since the 2021 coup
    worshipPlacesDamaged: 0,   // Worship places destroyed and damaged since the 2021 coup
    leadersProsecuted: 0       // Religious leaders illegitimately prosecuted since the 2021 coup
  },

  // "Townships where FoRB violations have occurred"
  // Number of affected townships per State / Region.
  townships: [
    { region: "Sagaing",  count: 0 },
    { region: "Magway",   count: 0 },
    { region: "Chin",     count: 0 },
    { region: "Karenni",  count: 0 },
    { region: "Kachin",   count: 0 },
    { region: "Karen",    count: 0 },
    { region: "Mandalay", count: 0 },
    { region: "Shan",     count: 0 },
    { region: "Rakhine",  count: 0 }
  ],

  // "Chronological attribution of FoRB violations since the 2021 coup"
  // Violations recorded per year, split by type.
  series: [
    { key: "killed",     label: "Religious leaders killed",   color: "#e2594b" },
    { key: "worship",    label: "Worship places damaged",     color: "#f19a2e" },
    { key: "prosecuted", label: "Leaders prosecuted",         color: "#8e5bd6" }
  ],
  timeline: [
    { year: "2021", killed: 0, worship: 0, prosecuted: 0 },
    { year: "2022", killed: 0, worship: 0, prosecuted: 0 },
    { year: "2023", killed: 0, worship: 0, prosecuted: 0 },
    { year: "2024", killed: 0, worship: 0, prosecuted: 0 },
    { year: "2025", killed: 0, worship: 0, prosecuted: 0 },
    { year: "2026", killed: 0, worship: 0, prosecuted: 0 }
  ]
};

/* ---- DEMO VALUES so the layout can be reviewed. Delete this block once
        real data is entered above. ---- */
(function demo(d) {
  if (!d.isPlaceholder) return;
  d.headline = { leadersKilled: 128, worshipPlacesDamaged: 312, leadersProsecuted: 74 };
  [42, 31, 18, 14, 12, 11, 9, 7, 5].forEach(function (n, i) { d.townships[i].count = n; });
  [[18, 40, 22], [31, 74, 15], [27, 81, 12], [24, 63, 10], [19, 38, 9], [9, 16, 6]]
    .forEach(function (r, i) {
      d.timeline[i].killed = r[0]; d.timeline[i].worship = r[1]; d.timeline[i].prosecuted = r[2];
    });
})(window.FORB_DATA);
