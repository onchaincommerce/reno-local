"use client";

import { useState } from "react";

export function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm text-white/80 hover:text-white underline underline-offset-2 transition-colors"
        aria-label="Learn how this works"
      >
        How this works
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-organic max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <h2
                    id="modal-title"
                    className="text-2xl font-bold text-kiwi-dark"
                  >
                    How this works
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-granite hover:text-charcoal text-2xl leading-none transition-colors"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6 text-granite">
                  <section>
                    <h3 className="text-lg font-bold text-kiwi-dark mb-2">
                      Local Retention Rates
                    </h3>
                    <p className="leading-relaxed">
                      When you spend money at a local business, a portion stays in Washoe County through:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Local wages paid to employees</li>
                      <li>Local rent and property costs</li>
                      <li>Local suppliers and vendors</li>
                      <li>Local owner profits that get reinvested</li>
                    </ul>
                    <p className="mt-3 text-sm bg-kiwi/10 p-3 rounded-lg border border-kiwi/30">
                      <strong>Based on Civic Economics studies:</strong> Local restaurants retain 65-79% locally vs ~30% at chains. Local retailers retain 52-56% vs ~14% at chain stores.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-kiwi-dark mb-2">
                      Total Economic Impact (Multiplier)
                    </h3>
                    <p className="leading-relaxed">
                      Beyond retention, each dollar creates ripple effects through the local economy. We use Washoe County IMPLAN multipliers to estimate total local activity:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4 text-sm">
                      <li>Food & Beverage: 1.21x multiplier</li>
                      <li>Retail Trade: 1.17x multiplier</li>
                      <li>Recreation & Entertainment: 1.06x multiplier</li>
                    </ul>
                    <p className="mt-2 text-sm text-granite/70">
                      Source: Reno-Tahoe visitor economy IMPLAN analysis (Washoe County)
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-kiwi-dark mb-2">
                      Why a range?
                    </h3>
                    <p className="leading-relaxed">
                      Different businesses retain different amounts locally. A locally-owned restaurant sourcing from local farms will retain more than one using national suppliers. The range reflects this variation.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-kiwi-dark mb-2">
                      Data Sources
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Civic Economics studies on local vs chain retention</li>
                      <li>Washoe County IMPLAN input-output models</li>
                      <li>Nevada Restaurant Association MSA data</li>
                      <li>UNR Washoe County NAICS sector analysis</li>
                    </ul>
                  </section>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-kiwi/30">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-6 py-3 rounded-organic bg-gradient-to-r from-kiwi to-kiwi-dark text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
