"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface Achievement {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: string;
  year: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  image: string;
  description: string;
}

interface RankingItem {
  id: string;
  title: string;
  position: number;
  organization: string;
  year: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin?: string;
}

const AboutUsPage: React.FC = () => {
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Corporate Clients Served",
      description: "Fortune 500 companies trust our solutions",
      value: "500+",
      icon: "🏢",
      year: "2024",
    },
    {
      id: "2",
      title: "Equipment Units Delivered",
      description: "Premium gym products distributed globally",
      value: "2M+",
      icon: "🏋️",
      year: "2024",
    },
    {
      id: "3",
      title: "Countries Worldwide",
      description: "International presence across continents",
      value: "45+",
      icon: "🌍",
      year: "2024",
    },
    {
      id: "4",
      title: "Years of Excellence",
      description: "Decades of industry leadership",
      value: "15+",
      icon: "⭐",
      year: "2024",
    },
    {
      id: "5",
      title: "Customer Satisfaction",
      description: "Consistently high satisfaction ratings",
      value: "98%",
      icon: "💯",
      year: "2024",
    },
    {
      id: "6",
      title: "Annual Revenue Growth",
      description: "Year-over-year growth rate",
      value: "35%",
      icon: "📈",
      year: "2024",
    },
  ];

  const rankings: RankingItem[] = [
    {
      id: "1",
      title: "Top B2B Gym Equipment Supplier",
      position: 1,
      organization: "Fitness Industry Association",
      year: "2024",
      description:
        "Recognized for outstanding service and product quality in corporate fitness solutions",
    },
    {
      id: "2",
      title: "Best Corporate Wellness Partner",
      position: 2,
      organization: "Corporate Health & Wellness Awards",
      year: "2023",
      description:
        "Awarded for innovative approach to workplace fitness and employee engagement",
    },
    {
      id: "3",
      title: "Fastest Growing Fitness Company",
      position: 3,
      organization: "Business Excellence Council",
      year: "2023",
      description:
        "Acknowledged for exceptional growth rate and market expansion",
    },
    {
      id: "4",
      title: "Innovation in Bulk Equipment Solutions",
      position: 1,
      organization: "Equipment Manufacturing Guild",
      year: "2022",
      description:
        "Leading innovation in bulk procurement and corporate fitness solutions",
    },
  ];

  const certifications: Certification[] = [
    {
      id: "1",
      name: "ISO 9001:2015",
      issuer: "International Organization for Standardization",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop",
      description:
        "Quality Management Systems certification ensuring consistent service delivery",
    },
    {
      id: "2",
      name: "CE Marking Compliance",
      issuer: "European Conformity Assessment",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=200&h=150&fit=crop",
      description:
        "European compliance certification for safety and quality standards",
    },
    {
      id: "3",
      name: "OSHA Safety Standards",
      issuer: "Occupational Safety and Health Administration",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop",
      description:
        "Workplace safety compliance certification for all equipment and operations",
    },
    {
      id: "4",
      name: "Green Business Certification",
      issuer: "Environmental Protection Agency",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=150&fit=crop",
      description:
        "Sustainable business practices and environmental responsibility certification",
    },
    {
      id: "5",
      name: "B2B Excellence Award",
      issuer: "Business-to-Business Marketing Association",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=150&fit=crop",
      description:
        "Recognition for outstanding B2B marketing and customer service excellence",
    },
    {
      id: "6",
      name: "Supply Chain Excellence",
      issuer: "Global Supply Chain Council",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=150&fit=crop",
      description:
        "Certification for efficient and reliable supply chain management practices",
    },
  ];

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "15+ years in fitness industry leadership, former VP at major equipment manufacturer",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Tech innovator with expertise in IoT fitness solutions and digital transformation",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "VP of Business Development",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Corporate wellness expert with track record of $100M+ in client partnerships",
    },
    {
      id: "4",
      name: "David Thompson",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
      bio: "Supply chain optimization specialist ensuring seamless global product delivery",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const counterVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <h1 className="text-6xl md:text-6xl font-bold leading-tight mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Venum B2B
                </span>
              </h1>
              <p className="text-2xl text-blue-100 mb-8 leading-relaxed">
                Transforming corporate wellness through innovative bulk gym
                equipment solutions for over 15 years.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Our Story
                </motion.button>
                <motion.button
                  className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Modern corporate gym facility"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Floating stats */}
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Corporate Clients</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-8 -right-8 bg-white rounded-2xl p-6 shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Our Story Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16 mb-28"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Founded in 2009 with a simple mission: make premium gym equipment
              accessible to businesses of all sizes through innovative bulk
              purchasing solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                From Startup to Industry Leader
              </h3>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  What started as a small venture in a garage has grown into the
                  leading B2B gym equipment supplier, serving Fortune 500
                  companies across 45 countries. Our journey began when our
                  founder, Sarah Johnson, recognized the gap between premium
                  fitness equipment and corporate budgets.
                </p>
                <p>
                  Through innovative bulk purchasing programs, strategic
                  partnerships with manufacturers, and unwavering commitment to
                  quality, we&apos;ve revolutionized how businesses approach
                  employee wellness. Today, we&apos;re proud to have equipped
                  over 2 million employees with the tools they need for
                  healthier, more productive work lives.
                </p>
                <p>
                  Our success stems from understanding that every company is
                  unique. Whether you&apos;re a tech startup needing compact
                  solutions or a manufacturing giant requiring comprehensive
                  fitness centers, we tailor our approach to meet your specific
                  needs and budget constraints.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
                      alt="Early days of FitCorp"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop"
                      alt="Corporate wellness program"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
                      alt="Modern gym facility"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop"
                      alt="Team collaboration"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Achievements Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16 mb-28"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Milestones that reflect our commitment to excellence and our
              clients&apos; success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={counterVariants}
                custom={index}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 text-center"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {achievement.value}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 mb-4">{achievement.description}</p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {achievement.year}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Rankings Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16 mb-28"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Industry Rankings
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Recognition from leading industry organizations validates our
              commitment to excellence.
            </p>
          </motion.div>

          <div className="space-y-6">
            {rankings.map((ranking, index) => (
              <motion.div
                key={ranking.id}
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white ${
                        ranking.position === 1
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                          : ranking.position === 2
                          ? "bg-gradient-to-br from-gray-400 to-gray-600"
                          : "bg-gradient-to-br from-orange-400 to-orange-600"
                      }`}
                    >
                      #{ranking.position}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {ranking.title}
                      </h3>
                      <span className="text-blue-600 font-semibold">
                        {ranking.year}
                      </span>
                    </div>
                    <p className="text-lg text-purple-600 font-semibold mb-3">
                      {ranking.organization}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {ranking.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Vision Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16 mb-28"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Vision & Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Shaping the future of corporate wellness through innovation,
              sustainability, and unwavering commitment to quality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                <p className="text-xl leading-relaxed">
                  To be the global leader in corporate fitness solutions, making
                  premium gym equipment accessible to every workplace, creating
                  healthier and more productive work environments worldwide.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-8 text-white">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-xl leading-relaxed">
                  To revolutionize corporate wellness by providing innovative
                  bulk equipment solutions, exceptional service, and strategic
                  partnerships that transform workplace culture and employee
                  well-being.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Core Values
              </h3>

              <div className="space-y-6">
                {[
                  {
                    icon: "💎",
                    title: "Quality First",
                    desc: "Premium products that exceed industry standards",
                  },
                  {
                    icon: "🤝",
                    title: "Partnership",
                    desc: "Building long-term relationships with our clients",
                  },
                  {
                    icon: "🌱",
                    title: "Sustainability",
                    desc: "Environmentally responsible business practices",
                  },
                  {
                    icon: "💡",
                    title: "Innovation",
                    desc: "Continuously evolving to meet changing needs",
                  },
                  {
                    icon: "🎯",
                    title: "Results",
                    desc: "Measurable impact on employee wellness and productivity",
                  },
                  {
                    icon: "🛡️",
                    title: "Integrity",
                    desc: "Transparent, honest, and ethical business conduct",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-md border border-gray-100"
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    <span className="text-2xl">{value.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {value.title}
                      </h4>
                      <p className="text-gray-600">{value.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Future Goals */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-900 rounded-3xl p-12 text-white"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4">
                Looking Ahead: 2025-2030
              </h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our roadmap for the next five years focuses on expansion,
                innovation, and sustainability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  year: "2025",
                  goal: "Expand to 60+ countries with localized support teams",
                },
                {
                  year: "2027",
                  goal: "Launch AI-powered equipment recommendation platform",
                },
                {
                  year: "2030",
                  goal: "Achieve carbon-neutral operations across all facilities",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    {item.year}
                  </div>
                  <p className="text-gray-300">{item.goal}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Certifications Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16 mb-28"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Certifications & Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our commitment to quality and safety is validated by
              industry-leading certifications and compliance standards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                variants={itemVariants}
                custom={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="relative h-40">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{cert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{cert.issuer}</span>
                    <span className="text-sm text-blue-600 font-semibold">
                      {cert.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              A diverse team of industry experts dedicated to driving
              FitCorp&apos;s mission forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{member.role}</p>
                  <p className="text-gray-700 mb-4">{member.bio}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};
export default AboutUsPage;
