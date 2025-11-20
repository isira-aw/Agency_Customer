import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Globe, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { settingsAPI } from "../../services/api";

export default function Home() {
  const [content, setContent] = useState({
    hero_title: "Your Gateway to European Employment",
    hero_subtitle:
      "Connecting talented professionals with opportunities across EU",
    about_text:
      "We specialize in placing skilled workers in positions throughout Europe.....",
    countries: ["Germany", "France", "Netherlands", "Belgium", "Austria"],
  });

  useEffect(() => {
    settingsAPI
      .getHomepageContent()
      .then((res) => setContent(res.data.value))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold mb-6">{content.hero_title}</h1>
            <p className="text-xl mb-8">{content.hero_subtitle}</p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold flex items-center mx-auto"
              >
                Get Started <ArrowRight className="ml-2" size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {content.about_text}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "EU Placement",
                desc: "Access to jobs across Europe",
                imageUrl:
                  "https://media.istockphoto.com/id/477698565/photo/glass-world-globe-earth-backgrounds-global.jpg?s=612x612&w=0&k=20&c=vud8aRwa9crtRDDYynTKbti_e1yA4ZU41_LTQXXRYG4=",
              },
              {
                icon: Users,
                title: "Career Support",
                desc: "Guidance every step",
                imageUrl:
                  "https://www.nsls.org/hs-fs/hubfs/Pillar%20Pages/Career%20Development/Self-Assessment%20Support%20Image.png?width=900&name=Self-Assessment%20Support%20Image.png",
              },
              {
                icon: Briefcase,
                title: "Professional Matching",
                desc: "Right job for your skills",
                imageUrl:
                  "https://media.istockphoto.com/id/1729511720/photo/3d-black-briefcase-with-golden-lock-floating-isolated-on-blue-background-office-work-job.jpg?s=612x612&w=0&k=20&c=2v3I15psUyKaoXNXH5WrJhi3Ank04_euFKebAk3M4PM=",
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="relative bg-cover bg-center bg-no-repeat p-6 rounded-lg shadow-lg text-center"
                style={{
                  backgroundImage: `url('${service.imageUrl}')`,
                }}
              >
                {/* <service.icon
                  className="mx-auto mb-4 text-blue-600"
                  size={48}
                /> */}
                <br /><br /><br />
                <h2 className="text-xl font-semibold mb-2 text-white">{service.title}</h2>
                <h3 className="text-white">
                  {service.desc}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Supported Countries
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {content.countries.map((country, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                {country}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold"
            >
              Register Now
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}
