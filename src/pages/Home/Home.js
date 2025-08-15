"use client";
import React from 'react'
import { useEffect } from 'react';

import Navbar from '@/components/Navbar';
import FooterDiv from '@/components/Footer';

import Hero from './Hero';
import Suggestions from './Suggestion';
import HostingBanner from './HostingBanner';
import FeaturedProperties from './FeaturedProperties';
import MoreProperties from './MoreProperties';
import GuidesAndTips from './Guide';

import Lenis from "lenis";

const Home = () => {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  return (
    <>
      <Navbar />

      <Hero />
      <Suggestions />
      <HostingBanner />
      <FeaturedProperties/>
      <MoreProperties/>
      <GuidesAndTips/>

      <FooterDiv/>
    </>
  )
}

export default Home
