// **Logo Sizing Changes:**

// - **Transparent state**: Increased from `w-20 h-20 sm:w-24 sm:h-24` to `w-32 h-24 sm:w-40 sm:h-28` with negative margins `-my-2 sm:-my-3`
// - **Solid state**: Increased from `w-18 h-18 sm:w-20 sm:h-20` to `w-28 h-20 sm:w-32 sm:h-24` with negative margins `-my-2`


// **Hover Reliability Fixes:**

// - Added `logoRestricted` state to control logo size when mega menus are open
// - Added direct `onMouseEnter` handlers to menu buttons
// - Reduced close delay from 300ms to 150ms for better responsiveness
// - Logo automatically restricts size when any mega menu is active to prevent cutting




"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { GetQuoteForm } from "@/pages/GetQuote"
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ShoppingCart,
  Hammer,
  Leaf,
  Info,
  Phone,
  PackageCheck,
  Facebook,
  Linkedin,
  Instagram,
  Home,
  Building,
} from "lucide-react"

// Pinterest Icon Component (inline to avoid import issues)
const PinterestIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12c1.018 0 2.006-.133 2.939-.379-1.339-.723-2.028-2.168-2.028-2.168s-.277-1.104-.277-2.615c0-1.53.874-2.676 1.96-2.676.926 0 1.375.695 1.375 1.528 0 .93-.593 2.322-.9 3.616-.256 1.083.544 1.966 1.613 1.966 1.938 0 3.432-2.043 3.432-4.991 0-2.612-1.878-4.439-4.555-4.439-3.103 0-4.924 2.326-4.924 4.732 0 .937.361 1.943.814 2.486.089.108.102.202.075.313-.08.336-.258 1.035-.293 1.181-.046.192-.149.233-.344.14-1.295-.603-2.106-2.494-2.106-4.016 0-3.273 2.378-6.278 6.854-6.278 3.599 0 6.398 2.565 6.398 5.996 0 3.578-2.255 6.456-5.386 6.456-1.051 0-2.041-.547-2.379-1.201 0 0-.52 1.982-.647 2.469-.234.897-.866 2.024-1.289 2.708.97.299 2 .458 3.063.458 6.626 0 12-5.374 12-12S18.626 0 12 0z" />
  </svg>
)

// Types
type DropdownItem = {
  name: string
  href: string
  description: string
  image?: string
  icon?: any
  iconClassName?: string
  recommended?: string
}

type NavigationItem = {
  name: string
  icon: any
  iconClassName?: string
  href?: string
  dropdown?: DropdownItem[]
}

type SocialLink = {
  name: string
  icon: any
  url: string
}

import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname
  const menuCloseTimer = useRef<NodeJS.Timeout | null>(null)

  // Memoized navigation items
  const navigationItems: NavigationItem[] = useMemo(
    () => [
      {
        name: "Solutions",
        icon: PackageCheck,
        dropdown: [
          {
            name: "Residential",
            href: "/solutions/residential",
            icon: Home,
            description: "Solar solutions for homes",
          },
          {
            name: "Commercial/Industrial",
            href: "/solutions/commercial-industrial",
            icon: Building,
            description: "Large-scale solar systems",
          },
        ],
      },
      {
        name: "Products",
        icon: ShoppingCart,
        href: "/products",
        dropdown: [
          {
            name: "Reliance Solar",
            href: "/reliance",
            image: "/reliance-industries-ltd.png",
            description: "Leading renewable energy solutions",
            recommended: "Recommended for commercial",
          },
          {
            name: "Shakti Solar",
            href: "/shakti-solar",
            image: "/Shakti%20Solar.png",
            description: "Innovative solar solutions",
            recommended: "Recommended for Residential",
          },
          {
            name: "Tata Solar",
            href: "/tata-solar",
            image: "/Tata%20Power%20Solar.png",
            description: "India's #1 Solar Rooftop Company",
            recommended: "Trusted choice for Residential & Commercial",
          },
          {
            name: "Waree | Adani",
            href: "/integrated",
            image: "/Integrated.png",
            description: "All-in-one integrated solar solutions",
            recommended: "Integrated"
          },
          {
            name: "Hybrid Solar Systems",
            href: "/hybrid-solar",
            image: "/Hybrid.png",
            description: "Smart solar solutions with battery backup",
            recommended: "Perfect for areas with power fluctuations"
          },
          
        ],
      },
      { name: "Services", icon: Hammer, href: "/services" },
      {
        name: "About",
        icon: Info,
        dropdown: [
          {
            name: "Sustainability",
            href: "/about/sustainability",
            icon: Leaf,
            iconClassName: "text-green-500",
            description: "Our commitment to environmental sustainability",
          },
          {
            name: "About Us",
            href: "/about/us",
            image: "/logo.png",
            description: "Our company story and mission",
          },
        ],
      },
      { name: "Contact", icon: Phone, href: "/contact" },
    ],
    [],
  )

  // Memoized social links
  const socialLinks: SocialLink[] = useMemo(
    () => [
      { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/@arpitsolar" },
      { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/arpit-solar-shop" },
      { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/arpitsolarweb/" },
      { name: "Pinterest", icon: PinterestIcon, url: "https://in.pinterest.com/arpitsolar/" },
    ],
    [],
  )

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (menuCloseTimer.current) {
        clearTimeout(menuCloseTimer.current)
      }
    }
  }, [])

  // Memoized handlers
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev
      document.documentElement.classList.toggle("dark", newMode)
      return newMode
    })
  }, [])

  const handleMenuEnter = useCallback((menuName: string) => {
    if (menuCloseTimer.current) {
      clearTimeout(menuCloseTimer.current)
      menuCloseTimer.current = null
    }
    setActiveDropdown(menuName)
  }, [])

  const handleMenuLeave = useCallback(() => {
    menuCloseTimer.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // Reduced delay for better responsiveness
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleSocialClick = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }, [])

  // Helper functions
  const isActivePath = useCallback((path: string) => pathname === path, [pathname])

  // Dropdown Content Component
  const DropdownContent = useCallback(
    ({ item, isTransparent }: { item: NavigationItem; isTransparent: boolean }) => {
      if (!item.dropdown) return null

      const baseClasses = isTransparent
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-white/20"
        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"

      const topPosition = isTransparent ? "73px" : "65px"

      return (
        <div
          className={`fixed left-0 right-0 ${baseClasses} border-b shadow-xl z-40`}
          style={{ top: topPosition, width: "100vw" }}
          onMouseEnter={() => handleMenuEnter(item.name)}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container mx-auto px-4 py-6">
            <div className={`${item.name === "Products" ? "max-w-6xl mx-auto" : "max-w-4xl mx-auto"}`}>
              <div
                className={`gap-4 ${
                  item.name === "Products"
                    ? "flex justify-center flex-wrap"
                    : item.name === "Solutions" || item.name === "About"
                      ? "grid grid-cols-1 sm:grid-cols-2"
                      : "space-y-2"
                }`}
              >
                {item.dropdown.map((dropdownItem) => (
                  <Link
                    key={`${item.name}-${dropdownItem.name}`}
                    to={dropdownItem.href}
                    className={`${
                      item.name === "Products" || item.name === "Solutions" || item.name === "About"
                        ? "flex flex-col items-center gap-3 p-4 min-w-[200px]"
                        : "flex items-center gap-3 p-3"
                    } cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-700 group`}
                  >
                    {(item.name === "Products" || item.name === "Solutions" || item.name === "About") && (
                      <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm group-hover:shadow-md transition-shadow duration-200 flex items-center justify-center">
                        {dropdownItem.icon ? (
                          <dropdownItem.icon
                            className={`w-10 h-10 ${dropdownItem.iconClassName || "text-gray-700 dark:text-gray-200 group-hover:text-gray-800 dark:group-hover:text-gray-100"}`}
                          />
                        ) : (
                          <img
                            src={dropdownItem.image || "/placeholder.svg?height=40&width=40"}
                            alt={dropdownItem.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        )}
                      </div>
                    )}
                    <div
                      className={
                        item.name === "Products" || item.name === "Solutions" || item.name === "About"
                          ? "text-center"
                          : "flex-1"
                      }
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                        {dropdownItem.name}
                      </div>
                      {dropdownItem.description && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 mt-1 transition-colors duration-200">
                          {dropdownItem.description}
                        </div>
                      )}
                      {dropdownItem.recommended && (
                        <div
                          className={`text-xs px-2 py-1 rounded-full mt-2 inline-block transition-colors duration-200 ${
                            dropdownItem.recommended === "Currently Out of Stock"
                              ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800"
                              : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800"
                          }`}
                        >
                          {dropdownItem.recommended}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    [handleMenuEnter, handleMenuLeave],
  )

  // Social Icons Component
  const SocialIcons = useCallback(
    ({ className }: { className: string }) => (
      <div className={className}>
        {socialLinks.map((social: SocialLink) => {
          const IconComponent = social.icon
          return (
            <Button
              key={social.name}
              variant="ghost"
              size="icon"
              className="w-8 h-8 transition-all duration-200"
              onClick={() => handleSocialClick(social.url)}
              aria-label={`Visit our ${social.name} page`}
            >
              <IconComponent />
            </Button>
          )
        })}
      </div>
    ),
    [socialLinks, handleSocialClick],
  )

  // Mobile Menu Component
  const MobileMenu = useCallback(() => {
    if (!isOpen) return null

    return (
      <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-2 z-50">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 pt-4 pb-4 space-y-2 max-h-[80vh] overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <item.icon className={`w-4 h-4 ${item.iconClassName || ""}`} />
                      {item.name}
                    </div>
                    <div
                      className={`gap-3 px-3 py-3 ${
                        item.name === "Products" ? "flex overflow-x-auto pb-2" : "grid grid-cols-1 xs:grid-cols-2"
                      }`}
                    >
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="flex flex-col items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 rounded-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-700 flex-shrink-0 min-w-[140px]"
                          onClick={closeMobileMenu}
                        >
                          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm flex items-center justify-center">
                            {dropdownItem.icon ? (
                              <dropdownItem.icon
                                className={`w-8 h-8 ${dropdownItem.iconClassName || "text-gray-700 dark:text-gray-200"}`}
                              />
                            ) : (
                              <img
                                src={dropdownItem.image || "/placeholder.svg?height=32&width=32"}
                                alt={dropdownItem.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                              {dropdownItem.name}
                            </div>
                            {dropdownItem.description && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[120px] whitespace-normal leading-tight">
                                {dropdownItem.description}
                              </div>
                            )}
                            {dropdownItem.recommended && (
                              <div
                                className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                                  dropdownItem.recommended === "Currently Out of Stock"
                                    ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                                    : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {dropdownItem.recommended}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href!}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                      isActivePath(item.href!)
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <item.icon className={`w-4 h-4 ${item.iconClassName || ""}`} />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            {/* Mobile Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-3">
              <div className="flex items-center justify-center space-x-3">
                {socialLinks.map((social: SocialLink) => {
                  const IconComponent = social.icon
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleSocialClick(social.url)}
                      aria-label={`Visit our ${social.name} page`}
                    >
                      <IconComponent />
                    </Button>
                  )
                })}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={toggleDarkMode}
                  className="flex-1 justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200"
                  onClick={() => {
                    setIsQuoteOpen(true)
                    closeMobileMenu()
                  }}
                >
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }, [isOpen, darkMode, isActivePath, closeMobileMenu, toggleDarkMode, handleSocialClick, navigationItems, socialLinks])

  // Main component logic
  const isHomePage = pathname === "/"
  const isTransparent = isHomePage && !scrolled && !activeDropdown
  const logoRestricted = activeDropdown !== null
  const underlineEffect =
    "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:transition-all after:duration-300"

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        {isTransparent ? (
          // Transparent navbar
          <div className="w-full px-4 py-2">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center pl-2 sm:pl-4">
                  <img
                    src="/logo.png"
                    alt="Arpit Solar Logo"
                    className={`object-contain transition-all duration-300 ${
                      logoRestricted
                        ? "w-24 h-16 sm:w-28 sm:h-20 -my-1 sm:-my-2" // Restricted size when mega menu open
                        : "w-32 h-24 sm:w-40 sm:h-28 -my-2 sm:-my-3" // Full size when no mega menu
                    }`}
                    loading="eager"
                  />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
                  {navigationItems.map((item) => (
                    <div
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => item.dropdown && handleMenuEnter(item.name)}
                      onMouseLeave={handleMenuLeave}
                    >
                      {item.dropdown ? (
                        <>
                          <Button
                            variant="ghost"
                            className={`flex items-center text-white hover:text-black space-x-1 px-3 xl:px-4 py-2 transition-colors duration-200 hover:bg-transparent ${underlineEffect} after:bg-blue-600 group-hover:after:w-full`}
                            onMouseEnter={() => handleMenuEnter(item.name)} // Added direct hover for better reliability
                          >
                            <item.icon
                              className={`w-4 h-4 mr-1 group-hover:text-black dark:group-hover:text-white transition-colors duration-200 ${item.iconClassName || ""}`}
                            />
                            <span className="text-sm font-medium group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
                              {item.name}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                          {activeDropdown === item.name && <DropdownContent item={item} isTransparent={true} />}
                        </>
                      ) : (
                        <Link
                          to={item.href!}
                          className={`flex items-center gap-1 px-3 xl:px-4 py-2 text-sm font-medium transition-colors duration-200 text-white ${underlineEffect} after:bg-white ${
                            isActivePath(item.href!) ? "after:w-full" : "after:w-0 group-hover:after:w-full"
                          }`}
                        >
                          <item.icon className={`w-4 h-4 mr-1 ${item.iconClassName || ""}`} />
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-2 sm:space-x-4 pr-2 sm:pr-4">
                  <SocialIcons className="hidden md:flex items-center space-x-2 text-white/80 hover:text-white" />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="hidden lg:flex w-8 h-8 sm:w-9 sm:h-9 text-white hover:text-white/80 transition-all duration-200"
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={() => setIsQuoteOpen(true)}
                    className="hidden lg:flex bg-white/20 hover:bg-white/30 text-white font-semibold px-4 sm:px-6 py-2 rounded-full border border-white/30 transition-all duration-200 text-sm"
                  >
                    Get Quote
                  </Button>

                  {/* Mobile Menu Button */}
                  <div className="lg:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMobileMenu}
                      className="w-8 h-8 sm:w-9 sm:h-9 text-white hover:text-white/80 transition-all duration-200"
                      aria-label="Toggle mobile menu"
                    >
                      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Solid navbar
          <div className="w-full bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center pl-2 sm:pl-4">
                  <img
                    src="/logo.png"
                    alt="Arpit Solar Logo"
                    className={`object-contain transition-all duration-300 ${
                      logoRestricted
                        ? "w-20 h-14 sm:w-24 sm:h-16 -my-1" // Restricted size when mega menu open
                        : "w-28 h-20 sm:w-32 sm:h-24 -my-1 sm:-my-2" // Full size when no mega menu
                    }`}
                    loading="eager"
                  />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
                  {navigationItems.map((item) => (
                    <div
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => item.dropdown && handleMenuEnter(item.name)}
                      onMouseLeave={handleMenuLeave}
                    >
                      {item.dropdown ? (
                        <>
                          <Button
                            variant="ghost"
                            className={`flex items-center text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white space-x-1 px-3 xl:px-4 py-2 transition-colors duration-200 hover:bg-transparent dark:hover:bg-transparent ${underlineEffect} after:bg-blue-600 dark:after:bg-blue-400 group-hover:after:w-full`}
                            onMouseEnter={() => handleMenuEnter(item.name)} // Added direct hover for better reliability
                          >
                            <item.icon
                              className={`w-4 h-4 mr-1 group-hover:text-black dark:group-hover:text-white transition-colors duration-200 ${item.iconClassName || ""}`}
                            />
                            <span className="text-sm font-medium group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
                              {item.name}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                          {activeDropdown === item.name && <DropdownContent item={item} isTransparent={false} />}
                        </>
                      ) : (
                        <Link
                          to={item.href!}
                          className={`flex items-center gap-1 px-3 xl:px-4 py-2 text-sm font-medium transition-colors duration-200 ${underlineEffect} after:bg-blue-600 dark:after:bg-blue-400 ${
                            isActivePath(item.href!)
                              ? "text-blue-600 dark:text-blue-400 after:w-full"
                              : "text-gray-700 dark:text-gray-200 after:w-0 group-hover:after:w-full"
                          }`}
                        >
                          <item.icon className={`w-4 h-4 mr-1 ${item.iconClassName || ""}`} />
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-2 sm:space-x-4 pr-2 sm:pr-4">
                  <SocialIcons className="hidden md:flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="hidden lg:flex w-8 h-8 sm:w-9 sm:h-9 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>

                  <Button
                    onClick={() => setIsQuoteOpen(true)}
                    className="hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-full transition-all duration-200 text-sm"
                  >
                    Get Quote
                  </Button>

                  {/* Mobile Menu Button */}
                  <div className="lg:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMobileMenu}
                      className="w-8 h-8 sm:w-9 sm:h-9 text-gray-700 dark:text-gray-200"
                      aria-label="Toggle mobile menu"
                    >
                      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Get Quote Modal */}
        <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
          <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] p-0 gap-0 border-0 bg-white text-black">
            <div className="h-1 w-full sunset-gradient" />
            <div className="p-4 sm:p-6 overflow-y-auto">
              <GetQuoteForm compact showHeader={false} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default Navbar







