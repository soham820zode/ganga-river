import { Hero } from '../components/hero/Hero';
import { Navbar } from '../components/navigation/Navbar';
import { DigitalTwin } from '../components/digital-twin/DigitalTwin';
import { RiverMap } from '../components/map/RiverMap';
import { StationExplorer } from '../components/stations/StationExplorer';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      
      <section id="digital-twin" className="relative w-full">
        <DigitalTwin />
      </section>

      <section id="river-map" className="relative w-full min-h-screen flex flex-col border-t border-white/[0.06]">
        
        {/* Section Header */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-accent mb-4 uppercase text-glow">
            Monitoring Network
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">
            WHERE THE RIVER IS BEING OBSERVED
          </h3>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Explore the demonstration monitoring network across the Ganga corridor. <br/>
            <span className="text-accent text-[10px] tracking-[0.3em] font-mono uppercase">SIMULATED / DEMO MONITORING NETWORK</span>
          </p>
        </div>

        {/* Map Layout */}
        <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto border-t border-white/[0.06] overflow-hidden h-[800px] max-h-[80vh] rounded-2xl mx-4 md:mx-8 aetheris-glass">
          <div className="w-full md:w-80 lg:w-[400px] flex-shrink-0 h-[400px] md:h-full z-10">
            <StationExplorer />
          </div>
          <div className="flex-1 h-[400px] md:h-full relative z-0">
            <RiverMap />
          </div>
        </div>
        
        <div className="h-20" />
      </section>
    </main>
  );
}
