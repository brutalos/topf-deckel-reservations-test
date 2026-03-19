import Link from 'next/link';

export default function TageskartePage() {
  return (
    <main className="min-h-screen pt-32 pb-20 font-sans bg-white">
      <div className="max-w-[66.666667%] mx-auto px-4 max-md:max-w-full">
        
        <div className="text-center mb-8">
          <p className="text-[#131318] text-lg font-medium">Heute</p>
        </div>

        {/* Promo Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          {/* LIGHT LUNCH KOMBO */}
          <div className="bg-[#E4F1EA] rounded-2xl p-6 relative overflow-hidden flex flex-col gap-2 max-md:p-4">
            <div className="flex justify-between items-center mb-2 max-md:mb-0">
              <h2 className="text-[1.25rem] font-black text-black uppercase tracking-tight m-0 max-md:text-[1rem]">LIGHT LUNCH KOMBO</h2>
              <span className="text-[1.25rem] font-extrabold text-black">€9.50</span>
            </div>
            
            <div className="bg-white rounded-xl p-5 flex justify-between items-center min-h-[100px] max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-3 max-md:p-4">
              <div className="flex flex-col gap-4 max-md:gap-1">
                <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Salat/Suppe klein + Main Dish klein</p>
                <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish klein + Getränk</p>
                <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish klein + Dessert</p>
              </div>
              <div className="bg-[#f3e5e9] text-black w-[94px] h-[90px] flex flex-col justify-center items-center text-center relative flex-shrink-0 ml-4 py-6 px-2 max-md:ml-0 max-md:w-[75px] max-md:h-[75px] max-md:py-4 max-md:px-1 max-md:self-center"
                   style={{ clipPath: 'polygon(100% 50%, 88.6% 59.6%, 96.6% 70.7%, 83.1% 75.5%, 85.4% 88.6%, 70.7% 88.6%, 67.1% 100%, 55.6% 91.9%, 50% 100%, 44.4% 91.9%, 32.9% 100%, 29.3% 88.6%, 14.6% 88.6%, 16.9% 75.5%, 3.4% 70.7%, 11.4% 59.6%, 0% 50%, 11.4% 40.4%, 3.4% 29.3%, 16.9% 24.5%, 14.6% 11.4%, 29.3% 11.4%, 32.9% 0%, 44.4% 8.1%, 50% 0%, 55.6% 8.1%, 67.1% 0%, 70.7% 11.4%, 85.4% 11.4%, 83.1% 24.5%, 96.6% 29.3%, 88.6% 40.4%)' }}>
                <span className="text-[0.85rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.6rem]">SPARE</span>
                <span className="text-[0.75rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.5rem]">bis zu</span>
                <span className="text-[1.1rem] font-black max-md:text-[0.95rem]">25%</span>
              </div>
            </div>
          </div>

          {/* BIG LUNCH KOMBO */}
          <div className="bg-[#E4F1EA] rounded-2xl p-6 relative overflow-hidden flex flex-col gap-2 max-md:p-4">
            <div className="flex justify-between items-center mb-2 max-md:mb-0">
              <h2 className="text-[1.25rem] font-black text-black uppercase tracking-tight m-0 max-md:text-[1rem]">BIG LUNCH KOMBO</h2>
              <span className="text-[1.25rem] font-extrabold text-black">€13.90</span>
            </div>
            
            <div className="bg-white rounded-xl p-5 flex justify-between items-center min-h-[100px] max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-3 max-md:p-4">
              <div className="flex flex-col gap-4 max-md:gap-1">
                <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Salat/Suppe klein + Main Dish groß</p>
                <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish groß + Getränk</p>
                <p className="text-[1rem] font-bold text-black m-0 max-md:text-[0.9rem] max-md:leading-[1.3]">Main Dish groß + Dessert</p>
              </div>
              <div className="bg-[#f3e5e9] text-black w-[94px] h-[90px] flex flex-col justify-center items-center text-center relative flex-shrink-0 ml-4 py-6 px-2 max-md:ml-0 max-md:w-[75px] max-md:h-[75px] max-md:py-4 max-md:px-1 max-md:self-center"
                   style={{ clipPath: 'polygon(100% 50%, 88.6% 59.6%, 96.6% 70.7%, 83.1% 75.5%, 85.4% 88.6%, 70.7% 88.6%, 67.1% 100%, 55.6% 91.9%, 50% 100%, 44.4% 91.9%, 32.9% 100%, 29.3% 88.6%, 14.6% 88.6%, 16.9% 75.5%, 3.4% 70.7%, 11.4% 59.6%, 0% 50%, 11.4% 40.4%, 3.4% 29.3%, 16.9% 24.5%, 14.6% 11.4%, 29.3% 11.4%, 32.9% 0%, 44.4% 8.1%, 50% 0%, 55.6% 8.1%, 67.1% 0%, 70.7% 11.4%, 85.4% 11.4%, 83.1% 24.5%, 96.6% 29.3%, 88.6% 40.4%)' }}>
                <span className="text-[0.85rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.6rem]">SPARE</span>
                <span className="text-[0.75rem] font-black uppercase leading-none mb-0.5 max-md:text-[0.5rem]">bis zu</span>
                <span className="text-[1.1rem] font-black max-md:text-[0.95rem]">20%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}