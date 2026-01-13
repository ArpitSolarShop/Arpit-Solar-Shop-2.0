"use client";

import { useState, useEffect, useCallback } from "react";
// import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import c1 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c1.jpg';
import c2 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c2.jpg';
import c3 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c3.jpg';
import c4 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c4.jpg';
import c5 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c5.jpg';
import c6 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c6.jpg';
import c7 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c7.jpg';
import c8 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c8.jpg';
import c9 from '@/assets/Arpit_Solar_Shop_Happy_Cuatomers/c9.jpg';

const customerImages = [c1.src, c2.src, c3.src, c4.src, c5.src, c6.src, c7.src, c8.src, c9.src];

interface Project {
  id: string;
  title: string;
  category: string;
  location: string | null;
  cover_image_url: string | null;
}

const ProjectHighlights = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectIndex, setProjectIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects?limit=6');
      const { data, error } = await response.json();

      if (error) {
        // Silently handle missing table or known errors
        console.warn("Projects API warning:", error);
        setProjects([]);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const nextProject = useCallback(() =>
    setProjectIndex((prev) => (prev + 1) % Math.max(1, projects.length - 2)),
    [projects.length]
  );

  const prevProject = useCallback(() =>
    setProjectIndex((prev) => (prev === 0 ? Math.max(0, projects.length - 3) : prev - 1)),
    [projects.length]
  );

  const visibleProjects = projects.slice(projectIndex, projectIndex + 3);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xl text-black animate-pulse">Loading Showcase...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 text-sm font-semibold bg-yellow-500/90 text-black rounded-full"
          >
            Featured Projects
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4 md:text-5xl">
            <span className="text-black">Our Project </span>
            <span className="text-yellow-500">Highlights</span>
          </h2>
          <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
            Discover our solar success stories in commercial and industrial sectors.
          </p>
        </header>

        {/* Project Cards */}
        {projects.length > 0 && (
          <div className="relative mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {visibleProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group rounded-xl overflow-hidden border border-gray-100 dark:border-muted/50 bg-white/90 dark:bg-card/90 shadow-md hover:shadow-lg hover:border-yellow-500/50 transition-all duration-300"
                  role="article"
                  aria-labelledby={`project-title-${project.id}`}
                >
                  <div className="relative aspect-[5/3] overflow-hidden">
                    {project.cover_image_url ? (
                      <>
                        <img
                          src={project.cover_image_url}
                          alt={project.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-yellow-500 to-orange-500 text-black text-4xl font-bold">
                        {project.category[0]}
                      </div>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-3 left-3 bg-yellow-500/90 text-black font-semibold rounded-full px-3 py-1 text-xs backdrop-blur-sm"
                    >
                      {project.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5 space-y-2">
                    <h3
                      id={`project-title-${project.id}`}
                      className="font-semibold text-xl text-black group-hover:text-yellow-500 line-clamp-2"
                    >
                      {project.title}
                    </h3>
                    {project.location && (
                      <div className="flex items-center text-sm text-black">
                        <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                        <span className="line-clamp-1">{project.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {projects.length > 3 && (
              <>
                <Button
                  onClick={prevProject}
                  size="icon"
                  variant="ghost"
                  className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white dark:bg-background shadow-md rounded-full hover:bg-yellow-500/90 transition-colors"
                  aria-label="Previous projects"
                  disabled={projectIndex === 0}
                >
                  <ArrowLeft className="h-5 w-5 text-black" />
                </Button>
                <Button
                  onClick={nextProject}
                  size="icon"
                  variant="ghost"
                  className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white dark:bg-background shadow-md rounded-full hover:bg-yellow-500/90 transition-colors"
                  aria-label="Next projects"
                  disabled={projectIndex >= projects.length - 3}
                >
                  <ArrowRight className="h-5 w-5 text-black" />
                </Button>
              </>
            )}
          </div>
        )}

        {/* Installation Slider */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-4 md:text-3xl">
            <span className="text-yellow-500">Installation </span>
            <span className="text-black">Glimpses</span>
          </h3>
          <p className="text-black text-base max-w-xl mx-auto">
            Moments captured from real customer sites
          </p>
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: true }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-12"
        >
          {customerImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="aspect-[3/4] bg-white rounded-xl shadow-md overflow-hidden border border-yellow-500/30 transition-transform duration-300 hover:scale-105">
                <img
                  src={image}
                  alt={`Installation moment ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Stats Section with Light Sun Color Background and Sun/Black Text */}
      {/* <section className="bg-yellow-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">3453</div>
              <div className="text-lg font-medium text-black">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">4234</div>
              <div className="text-lg font-medium text-black">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">3123</div>
              <div className="text-lg font-medium text-black">Awards Won</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">1831</div>
              <div className="text-lg font-medium text-black">Expert Workers</div>
            </div>
          </div>
        </div>
      </section> */}
    </section>
  );
};

export default ProjectHighlights;