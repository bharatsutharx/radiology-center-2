import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Clock, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Our Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated to providing exceptional medical imaging services with state-of-the-art technology and
            compassionate care.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Excellence in Medical Imaging</h2>
              <p className="text-gray-600 mb-6">
                Dr. Bhajan Sonography CT, MRI Centre has been serving the community for over 15 years, providing
                comprehensive diagnostic imaging services. Our commitment to excellence, combined with cutting-edge
                technology and experienced radiologists, ensures accurate diagnoses and exceptional patient care.
              </p>
              <p className="text-gray-600 mb-6">
                We understand that medical imaging can be stressful, which is why we prioritize patient comfort and
                clear communication throughout the entire process. Our team is dedicated to making your experience as
                smooth and comfortable as possible.
              </p>
              <p className="text-gray-600">
                From routine screenings to complex diagnostic procedures, we are equipped to handle all your medical
                imaging needs with precision and care.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">15+ Years</h3>
                <p className="text-gray-600 text-sm">Experience in Medical Imaging</p>
              </Card>
              <Card className="text-center p-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">50,000+</h3>
                <p className="text-gray-600 text-sm">Patients Served</p>
              </Card>
              <Card className="text-center p-6">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">24/7</h3>
                <p className="text-gray-600 text-sm">Emergency Services</p>
              </Card>
              <Card className="text-center p-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">100%</h3>
                <p className="text-gray-600 text-sm">Accredited Facility</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide exceptional diagnostic imaging services that enable accurate diagnoses and improved patient
                  outcomes. We are committed to delivering compassionate care while utilizing the most advanced medical
                  imaging technology available.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be the leading medical imaging center in the region, recognized for our clinical excellence,
                  innovative technology, and patient-centered approach. We strive to set the standard for quality
                  diagnostic imaging services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Expert Team</h2>
            <p className="text-xl text-gray-600">
              Board-certified radiologists and experienced technologists dedicated to your care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Bhajan Singh</h3>
                <p className="text-blue-600 mb-2">Chief Radiologist</p>
                <p className="text-gray-600 text-sm">MD Radiology, 20+ years experience in diagnostic imaging</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Priya Sharma</h3>
                <p className="text-blue-600 mb-2">Senior Radiologist</p>
                <p className="text-gray-600 text-sm">Specialized in MRI and CT imaging, 15+ years experience</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rajesh Kumar</h3>
                <p className="text-blue-600 mb-2">Chief Technologist</p>
                <p className="text-gray-600 text-sm">Certified in all imaging modalities, 12+ years experience</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
