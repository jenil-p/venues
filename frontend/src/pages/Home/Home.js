"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import Suggestions from './Suggestion';
import { venueService } from '@/api/venue.service';
import Lenis from "lenis";

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Smooth Scroll Setup
  // useEffect(() => {
  //   const lenis = new Lenis();
  //   function raf(time) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }
  //   requestAnimationFrame(raf);
  //   return () => lenis.destroy();
  // }, []);

  // Data Fetching
  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        const response = await venueService.getVenues();
        setVenues(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <Suggestions venues={venues} isLoading={loading} />

      <FooterDiv />
    </main>
  );
};

export default Home;