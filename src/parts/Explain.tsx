import { memo } from "react";

const styles = {
  container: "px-6 py-4 bg-stone-100 border-b border-stone-300 text-sm max-w-4xl space-y-2",
};

function Explain() {
  return (
    <div className={styles.container}>
      <p><b>Why the poles are hard.</b> The Moon's axis is tilted only about 1.5°, so near the south pole the Sun circles the horizon and never climbs higher than a few degrees. Hills and crater rims decide whether a spot gets light, so moving a few kilometers or a few days can flip it from sunlit to dark.</p>
      <p><b>Power.</b> Solar panels need the Sun above the local horizon. A low Sun gives weak power and long shadows. No atmosphere means no twilight: sunset is abrupt.</p>
      <p><b>Communication.</b> Direct-to-Earth links need Earth above the horizon. From the pole Earth hugs the horizon and swings with libration (the Moon's wobble), so Earth comes and goes over each month.</p>
      <p><b>Reading the tool.</b> The curved line marks the local terrain horizon. The Sun or Earth is visible when it is above that line. "Longest gap" is the longest stretch with no Sun or no Earth in the 30-day window.</p>
    </div>
  );
}

export default memo(Explain);
