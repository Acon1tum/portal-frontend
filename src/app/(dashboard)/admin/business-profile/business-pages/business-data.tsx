// Mock data services for the business profile
// This file contains helper functions to generate sample data 
// based on the business industry from dummy-data.ts

// Product-related functions
export interface Product {
    name: string;
    description: string;
    category: string;
    image: string;
    price?: string;
  }
  
  export function getProductsForBusiness(industry: string): Product[] {
    const products: Product[] = [];
    
    if (industry === "Technology") {
      products.push(
        { 
          name: "Cloud Migration Services", 
          description: "Seamlessly transition your infrastructure to the cloud with our expert migration services.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Cybersecurity Suite", 
          description: "Comprehensive protection against modern threats with our advanced security solutions.",
          category: "Products",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
          price: "$299/mo"
        },
        { 
          name: "Enterprise CRM", 
          description: "Manage customer relationships effectively with our scalable CRM platform.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
          price: "$199/mo"
        },
        { 
          name: "Custom App Development", 
          description: "Tailored application development to meet your specific business needs.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Data Analytics Platform", 
          description: "Turn your data into actionable insights with our powerful analytics tools.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
          price: "$349/mo"
        },
        { 
          name: "IoT Solutions", 
          description: "Connect and monitor your devices with our Internet of Things integration services.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        }
      );
    } else if (industry === "Supply Chain") {
      products.push(
        { 
          name: "Supply Chain Optimization", 
          description: "Streamline your supply chain operations for maximum efficiency and cost savings.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1577577196753-13d587105825?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Logistics Management Software", 
          description: "End-to-end visibility and control over your logistics operations.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
          price: "$499/mo"
        },
        { 
          name: "Inventory Management System", 
          description: "Real-time inventory tracking and optimization to reduce costs and stockouts.",
          category: "Products",
          image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop",
          price: "$299/mo"
        },
        { 
          name: "Global Shipping Services", 
          description: "Reliable international shipping with tracking and customs management.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Last Mile Delivery Solutions", 
          description: "Efficient and cost-effective delivery for the final leg of your supply chain.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2070&auto=format&fit=crop",
          price: "Starting at $199/mo"
        },
        { 
          name: "Supply Chain Analytics", 
          description: "Data-driven insights to optimize your entire supply chain network.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
          price: "$399/mo"
        }
      );
    } else if (industry === "Manufacturing") {
      products.push(
        { 
          name: "Rapid Prototyping", 
          description: "Quick production of physical prototypes to validate your designs before full production.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1565608438257-fac3c27aa640?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "3D Printing Solutions", 
          description: "Advanced 3D printing services for complex parts and prototypes.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1581093458791-9f9a7d3c9b81?q=80&w=2070&auto=format&fit=crop",
          price: "Starting at $99"
        },
        { 
          name: "CNC Machining", 
          description: "Precision CNC machining for high-quality metal and plastic parts.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1612886135827-0a365eb81b8e?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Production Automation", 
          description: "Streamline your manufacturing processes with custom automation solutions.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1586374579358-9d19d632b6d7?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Quality Control Systems", 
          description: "Comprehensive quality assurance protocols and systems for manufacturing.",
          category: "Products",
          image: "https://images.unsplash.com/photo-1612886135827-0a365eb81b8e?q=80&w=2070&auto=format&fit=crop",
          price: "Starting at $499"
        },
        { 
          name: "Manufacturing MES Software", 
          description: "Manufacturing Execution System to optimize production workflows.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1581093199637-4767bf2cc712?q=80&w=2070&auto=format&fit=crop",
          price: "$599/mo"
        }
      );
    } else if (industry === "Healthcare") {
      products.push(
        { 
          name: "Electronic Health Records", 
          description: "Secure and compliant EHR system for healthcare providers.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
          price: "$299/mo"
        },
        { 
          name: "Telemedicine Platform", 
          description: "Connect with patients remotely with our HIPAA-compliant telemedicine solution.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2033&auto=format&fit=crop",
          price: "$199/mo"
        },
        { 
          name: "Patient Portal", 
          description: "Secure patient access to medical records, appointments, and communications.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=2033&auto=format&fit=crop",
          price: "$149/mo"
        },
        { 
          name: "Healthcare Analytics", 
          description: "Data-driven insights to improve patient outcomes and operational efficiency.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Medical Device Integration", 
          description: "Seamlessly connect medical devices with your healthcare IT systems.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Compliance Consulting", 
          description: "Expert guidance on healthcare regulations and compliance requirements.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
          price: "Starting at $999"
        }
      );
    } else if (industry === "Finance") {
      products.push(
        { 
          name: "Financial Security Suite", 
          description: "Comprehensive security solutions for financial institutions.",
          category: "Products",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
          price: "$599/mo"
        },
        { 
          name: "Compliance Management", 
          description: "Stay compliant with financial regulations and requirements.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Fraud Detection System", 
          description: "AI-powered fraud detection and prevention for financial transactions.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
          price: "$399/mo"
        },
        { 
          name: "Digital Banking Platform", 
          description: "Modern, secure banking experience for your customers.",
          category: "Software",
          image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop",
          price: "Starting at $999/mo"
        },
        { 
          name: "Financial Analytics", 
          description: "Data-driven insights for better financial decision making.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Payment Processing Solutions", 
          description: "Secure and efficient payment processing for financial institutions.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        }
      );
    } else {
      // Default products for other industries
      products.push(
        { 
          name: "Consulting Services", 
          description: "Expert consulting tailored to your industry needs.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Business Analytics", 
          description: "Data-driven insights to improve your business performance.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
          price: "Starting at $299/mo"
        },
        { 
          name: "Custom Solutions", 
          description: "Tailored solutions designed specifically for your business challenges.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
          price: "Custom"
        },
        { 
          name: "Training Programs", 
          description: "Comprehensive training to upskill your team.",
          category: "Services",
          image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
          price: "Starting at $199"
        }
      );
    }
    
    return products;
  }
  
  export function getProductCategories(industry: string): string[] {
    switch (industry) {
      case "Technology":
        return ["Services", "Products", "Software"];
      case "Supply Chain":
        return ["Services", "Software", "Products"];
      case "Manufacturing":
        return ["Services", "Products", "Software"];
      case "Healthcare":
        return ["Software", "Services", "Products"];
      case "Finance":
        return ["Products", "Services", "Software"];
      default:
        return ["Services", "Products"];
    }
  }
  
  // Team-related functions
  export interface TeamMember {
    name: string;
    title: string;
    bio: string;
    photo: string;
  }
  
  export function getTeamMembers(): TeamMember[] {
    return [
      {
        name: "Alex Johnson",
        title: "CEO / Founder",
        bio: "Over 15 years of experience in the industry. Passionate about innovation and customer satisfaction.",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Samantha Liu",
        title: "CTO",
        bio: "Tech enthusiast with expertise in emerging technologies and system architecture.",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Michael Davis",
        title: "Head of Sales",
        bio: "Building strong client relationships and driving business growth for over a decade.",
        photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Priya Sharma",
        title: "Lead Developer",
        bio: "Expert in software development with a focus on creating scalable and efficient solutions.",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop"
      },
      {
        name: "James Wilson",
        title: "Marketing Director",
        bio: "Creative strategist specializing in digital marketing and brand development.",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Olivia Chen",
        title: "Product Manager",
        bio: "Passionate about creating user-centric products that solve real-world problems.",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2061&auto=format&fit=crop"
      },
      {
        name: "Robert Kim",
        title: "Customer Success Manager",
        bio: "Dedicated to ensuring clients achieve their goals and maximize value from our services.",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Emily Rodriguez",
        title: "UX Designer",
        bio: "Crafting beautiful, intuitive interfaces with a focus on exceptional user experiences.",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2064&auto=format&fit=crop"
      }
    ];
  }
  
  // Review-related functions
  export interface Review {
    author: string;
    date: string;
    rating: number;
    comment: string;
    response?: string;
  }
  
  export function getReviews(): Review[] {
    return [
      {
        author: "David Thompson",
        date: "January 15, 2023",
        rating: 5,
        comment: "Exceptional service and professionalism. The team went above and beyond to meet our needs and delivered outstanding results. Highly recommended for anyone looking for quality and reliability.",
        response: "Thank you for your kind words, David! We're thrilled to hear about your positive experience and look forward to serving you again in the future."
      },
      {
        author: "Jennifer Martinez",
        date: "February 3, 2023",
        rating: 4,
        comment: "Great experience overall. The team was responsive and knowledgeable. The only reason for 4 stars instead of 5 is that the project took slightly longer than initially estimated.",
      },
      {
        author: "Mark Wilson",
        date: "March 22, 2023",
        rating: 5,
        comment: "We've been working with this company for over a year now, and they consistently deliver excellent results. Their attention to detail and commitment to quality is impressive.",
        response: "Thank you for being a loyal client, Mark! We value our ongoing relationship and are committed to maintaining the high standards you've come to expect from us."
      },
      {
        author: "Sarah Johnson",
        date: "April 10, 2023",
        rating: 3,
        comment: "The product quality is good, but there were some communication issues during the process. I'd recommend more frequent updates on project status.",
        response: "Sarah, thank you for your honest feedback. We appreciate you bringing this to our attention and are taking steps to improve our communication processes. We'll be reaching out directly to discuss how we can better serve you in the future."
      },
      {
        author: "Robert Chen",
        date: "May 5, 2023",
        rating: 5,
        comment: "Excellent work! The team understood our requirements perfectly and delivered a solution that exceeded our expectations. Will definitely use their services again.",
      },
      {
        author: "Lisa Garcia",
        date: "June 12, 2023",
        rating: 4,
        comment: "Very professional team with strong technical expertise. The only suggestion would be to simplify some of the technical explanations for clients who aren't as tech-savvy.",
      }
    ];
  }
  
  export function getReviewPercentage(rating: number): number {
    const reviews = getReviews();
    const totalReviews = reviews.length;
    const ratingCount = reviews.filter(review => review.rating === rating).length;
    
    return Math.round((ratingCount / totalReviews) * 100);
  }