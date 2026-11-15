const styles = {
  root: "border-b border-slate-800 bg-slate-900/60",
  inner: "mx-auto grid max-w-7xl gap-4 px-6 py-5 text-sm leading-relaxed text-slate-300 md:grid-cols-2",
  heading: "font-medium text-white",
};

const items = [
  ["Why the poles are hard", "The Moon's axis is tilted only about 1.5°, so near the south pole the Sun circles the horizon and never climbs more than a few degrees. Hills and crater rims decide who gets light, so a few kilometers or a few days can flip a site from lit to dark."],
  ["Power", "Panels need the Sun above the local horizon. A low Sun gives weak power and long shadows. There is no atmosphere, so no twilight: sunset is abrupt."],
  ["Communication", "A direct link needs Earth above the horizon. From the pole, Earth hugs the horizon and swings with libration, so it comes and goes over the month."],
  ["Reading the tool", "The curved line marks the local terrain horizon. The Sun or Earth is visible when it is above that line. Longest gap is the longest stretch without Sun or Earth in 30 days."],
];

export default function Explain() {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        {items.map(([h, t]) => (
          <div key={h}><h3 className={styles.heading}>{h}</h3><p>{t}</p></div>
        ))}
      </div>
    </section>
  );
}
