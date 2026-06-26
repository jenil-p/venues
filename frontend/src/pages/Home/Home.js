"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';
import Suggestions from './Suggestion';
import { venueService } from '@/api/venue.service';
import Lenis from "lenis";

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [wishlist, setWishlist] = useState([]);
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
    async function fetchData() {
      try {
        setLoading(true);

        const venuesResponse = await venueService.getVenues();
        setVenues(venuesResponse.data);

        try {
          const wishlistResponse = await venueService.getWishlist();
          setWishlist(wishlistResponse.wishlists);
        } catch (wishlistError) {
          // user not logged in
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <Suggestions venues={venues} wishlist={wishlist} isLoading={loading} />

      <FooterDiv />
    </main>
  );
};

export default Home;