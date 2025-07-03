import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import ClashCard from './ClashCard';
import type { RaffleItem, TicketRegistration } from '../types';

interface RaffleSectionProps {
  raffleItems: RaffleItem[];
  ticketRegistrations: TicketRegistration[]; // Added prop
  onNavigateToVerifyTicketScreen?: () => void;
  onAddTicketRegistration: (registration: TicketRegistration) => void;
  onGridCardDrawCompleted: (raffleId: string, winningNumber: string) => void;
}

const RaffleSection: React.FC<RaffleSectionProps> = ({ 
  raffleItems, 
  ticketRegistrations, // Destructure new prop
  onNavigateToVerifyTicketScreen, 
  onAddTicketRegistration, 
  onGridCardDrawCompleted 
}) => {
  const seventyTwoHoursAgo = useMemo(() => Date.now() - 72 * 60 * 60 * 1000, []);

  const visibleRaffleItems = useMemo(() => {
    return raffleItems
      .filter(item => {
        if (item.isGridCardDrawComplete) {
            const drawTime = item.targetDate ? new Date(item.targetDate).getTime() : 0; 
            return drawTime > seventyTwoHoursAgo;
        }
        if (!item.targetDate) return true;
        return new Date(item.targetDate).getTime() > Date.now() - (10 * 60 * 1000); 
      })
      .sort((a, b) => {
        const aIsFeatured = a.isFeatured || false;
        const bIsFeatured = b.isFeatured || false;
        if (aIsFeatured && !bIsFeatured) return -1;
        if (!aIsFeatured && bIsFeatured) return 1;

        const aIsComplete = a.isGridCardDrawComplete || false;
        const bIsComplete = b.isGridCardDrawComplete || false;

        if (!aIsComplete && bIsComplete) return -1;
        if (aIsComplete && !bIsComplete) return 1;
        
        const aTargetTime = a.targetDate ? new Date(a.targetDate).getTime() : (aIsComplete ? 0 : Infinity);
        const bTargetTime = b.targetDate ? new Date(b.targetDate).getTime() : (bIsComplete ? 0 : Infinity);
        
        return aTargetTime - bTargetTime;
      });
  }, [raffleItems, seventyTwoHoursAgo]);

  if (visibleRaffleItems.length === 0) {
    return (
      <section className="sorteo-info mb-8 py-10">
        <div className="text-center">
          <h2 className="text-3xl font-['Orbitron'] font-medium text-[#f7ca18]">Gran Sorteo Pukatu</h2>
          <p className="text-base text-gray-300 mt-2">No hay sorteos activos o recientemente finalizados para mostrar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="sorteo-info mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-['Orbitron'] font-medium text-[#f7ca18]">Gran Sorteo Pukatu</h2>
        <p className="text-base text-gray-300 mt-1.5">¡Participa ahora y gana increíbles premios!</p>
      </div>

      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true, el: '.swiper-custom-pagination' }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="mySwiper w-full py-4"
        // Swiper CSS variables are now globally defined in index.html
      >
        {visibleRaffleItems.map((item) => (
          <SwiperSlide key={item.id} className="!w-[220px] !h-auto md:!w-[260px]">
            <ClashCard 
              item={item} 
              ticketRegistrations={ticketRegistrations} // Pass down ticketRegistrations
              onNavigateToVerifyTicketScreen={onNavigateToVerifyTicketScreen}
              onAddTicketRegistration={onAddTicketRegistration}
              onGridCardDrawCompleted={onGridCardDrawCompleted}
            />
          </SwiperSlide>
        ))}
        <div className="swiper-custom-pagination text-center mt-3"></div>
      </Swiper>
    </section>
  );
};

export default RaffleSection;