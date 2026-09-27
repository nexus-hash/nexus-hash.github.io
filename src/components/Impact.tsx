import Flow from "./Flow";
import Ledger from "./Ledger";

/** The second page: what the work looks like end to end, and what came of it. */
export default function Impact() {
  return (
    <section className="section impact" id="impact" aria-label="Impact">
      <div className="wrap">
        <Flow />
        <Ledger />
      </div>
    </section>
  );
}
