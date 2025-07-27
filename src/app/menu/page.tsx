import React from "react";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";

export default function MenuPage() {
  return (
    <div className="bg-[#F5F5F5] min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex-grow">
        <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-5xl font-extrabold text-[#181871] mb-12 tracking-tight">
            Favoriting encouraged
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-start max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="rounded-[18px] overflow-hidden shadow-lg flex flex-col bg-[#5A8DF6] border border-[#5A8DF6]">
              <div className="relative flex flex-col items-center pt-8 pb-4">
                <img
                  src="/salad1.png"
                  alt="Honey Crispy Chicken"
                  className="w-60 h-60 object-cover rounded-full mx-auto shadow-xl border-4 border-white"
                  style={{ marginTop: "-40px" }}
                />
                <img
                  src="/badge.png"
                  alt="badge"
                  className="absolute top-4 right-4 w-14 h-14"
                />
              </div>
              <div className="bg-[#F9F9F9] flex-1 flex flex-col justify-between px-6 pt-4 pb-6 rounded-b-[18px]">
                <h3 className="text-2xl font-extrabold text-[#181871] mb-2">
                  Honey Crispy Chicken
                </h3>
                <div className="flex justify-center gap-4 text-[#181871] text-sm font-medium mb-4">
                  <span>500 Cal</span>
                  <span>—</span>
                  <span>26 G of Protein</span>
                  <span>—</span>
                  <span>1.49 kg CO₂e</span>
                </div>
                <button className="w-full mt-auto border-2 border-[#181871] rounded-full py-2 font-bold text-[#181871] hover:bg-[#181871] hover:text-white transition">
                  CRUNCH IT
                </button>
              </div>
            </div>
            {/* Card 2 */}
            <div className="rounded-[18px] overflow-hidden shadow-lg flex flex-col bg-[#FFB43A] border border-[#FFB43A]">
              <div className="relative flex flex-col items-center pt-8 pb-4">
                <img
                  src="/salad2.png"
                  alt="Parm Crunch"
                  className="w-60 h-60 object-cover rounded-full mx-auto shadow-xl border-4 border-white"
                  style={{ marginTop: "-40px" }}
                />
                <img
                  src="/badge.png"
                  alt="badge"
                  className="absolute top-4 right-4 w-14 h-14"
                />
              </div>
              <div className="bg-[#F9F9F9] flex-1 flex flex-col justify-between px-6 pt-4 pb-6 rounded-b-[18px]">
                <h3 className="text-2xl font-extrabold text-[#181871] mb-2">
                  Parm Crunch
                </h3>
                <div className="flex justify-center gap-4 text-[#181871] text-sm font-medium mb-4">
                  <span>520 Cal</span>
                  <span>—</span>
                  <span>52 G of Protein</span>
                  <span>—</span>
                  <span>1.3 kg CO₂e</span>
                </div>
                <button className="w-full mt-auto border-2 border-[#181871] rounded-full py-2 font-bold text-[#181871] hover:bg-[#181871] hover:text-white transition">
                  MUNCH IT
                </button>
              </div>
            </div>
            {/* Card 3 */}
            <div className="rounded-[18px] overflow-hidden shadow-lg flex flex-col bg-[#E94B35] border border-[#E94B35]">
              <div className="relative flex flex-col items-center pt-8 pb-4">
                <img
                  src="/salad3.png"
                  alt="Dirt Candy"
                  className="w-60 h-60 object-cover rounded-full mx-auto shadow-xl border-4 border-white"
                  style={{ marginTop: "-40px" }}
                />
                <img
                  src="/badge.png"
                  alt="badge"
                  className="absolute top-4 right-4 w-14 h-14"
                />
              </div>
              <div className="bg-[#F9F9F9] flex-1 flex flex-col justify-between px-6 pt-4 pb-6 rounded-b-[18px]">
                <h3 className="text-2xl font-extrabold text-[#181871] mb-2">
                  Dirt Candy
                </h3>
                <div className="flex justify-center gap-4 text-[#181871] text-sm font-medium mb-4">
                  <span>360 Cal</span>
                  <span>—</span>
                  <span>16 G of Protein</span>
                  <span>—</span>
                  <span>0.83 kg CO₂e</span>
                </div>
                <button className="w-full mt-auto border-2 border-[#181871] rounded-full py-2 font-bold text-[#181871] hover:bg-[#181871] hover:text-white transition">
                  LUNCH IT
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <AppFooter />
    </div>
  );
}
