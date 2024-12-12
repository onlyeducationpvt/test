// API Service for different endpoints
const APIService = {
  baseURL: "https://admin.onlyeducation.co.in", // Replace with your actual API base URL

  // Generic fetch wrapper with error handling
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  // Specific API endpoints
  // getLatestNotifications: () => APIService.fetchData("/api/news?populate[image]=true&filters[category][slug][$eq]=mba"),
  getFeaturedExams: () =>
    APIService.fetchData(
      "/api/exams?populate[exam_logo][populate]=true&populate[highlights][populate]=true&filters[slug][$in]=cat-common-admission-test&filters[slug][$in]=xat-xavier-aptitude-test&filters[slug][$in]=cmat-common-management-admission-test&filters[slug][$in]=mat-management-aptitude-test&filters[slug][$in]=nmat-nmat-by-gmac&filters[slug][$in]=snap-symbiosis-national-aptitude-test&filters[slug][$in]=ipmat-iim-indore-integrated-program-in-management-aptitude-test&filters[slug][$in] =ibsat-ibs-aptitude-test&filters[slug][$in]=mat-management-aptitude-test"
    ),
  getTopColleges: () =>
    APIService.fetchData(
      "/api/universityys?populate[logo][populate]=true&populate[tabs][populate][sections]=true&populate[highlights][populate]=true&filters[slug][$in]=sydenham-college-of-commerce-and-economics-scce-mumbai&filters[slug][$in]=sjmsom-mumbai&filters[slug][$in]=sies-mumbai&filters[slug][$in]=nmims-anil-surendra-modi-school-of-commerce&filters[slug][$in]=sp-jain-institute-of-management-and-research&filters[slug][$in]=sjmsom-mumbai&filters[slug][$in]=nmims-anil-surendra-modi-school-of-commerce&filters[slug][$in]=symbiosis-centre-for-management-and-human-resource-development&filters[slug][$in]=jamnalal-bajaj-institute-of-management-studies&filters[slug][$in]=welingkar-mumbai&filters[slug][$in]=institute-of-management-technology-imt-n-nagpur&filters[slug][$in]=pumba-pune&filters[slug][$in]=chetana-s-rk-institute-of-management-and-research&filters[slug][$in]=k-j-somaiya-college-of-arts-and-commerce"
    ),
  getFaqs: () => APIService.fetchData("/faqs"),
};

// Component handlers
document.addEventListener("DOMContentLoaded", async () => {
  // Function to load news data from API
  async function loadNews() {
    const container = document.getElementById("news-slider-container");
    container.innerHTML = '<div class="text-center py-4">Loading news...</div>';
    try {
      const response = await fetch(
        "https://admin.onlyeducation.co.in/api/news?populate[image]=true&filters[category][slug][$eq]=engineering&pagination[limit]=8&sort[0]=createdAt:desc"
      );
      const { data } = await response.json();

      const newsHTML = data
        .map(
          (item) => `
              <div class="swiper-slide">
                  <div class="news-card">
                      <img src="${item.attributes.image.data.attributes.url}" alt="${item.attributes.title}" />
                      <div class="news-card-content">
                          <h3 class="line-clamp-2">${item.attributes.title}</h3>
                          <p class="line-clamp-3">${item.attributes.description}...</p>
                         <button onclick="window.location.href='/news.html?id=${item.id}'">Read More</button>

                      </div>
                  </div>
              </div>
          `
        )
        .join("");

      container.innerHTML = newsHTML;

      // Initialize Swiper after adding slides
      new Swiper(".swiper-container", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          // Enable autoplay
          delay: 3000, // Slide delay in milliseconds
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    } catch (error) {
      container.innerHTML =
        '<div class="text-center py-4 text-red-600">Failed to load news. Please try again later.</div>';
    }
  }

  // Load news on page load
  loadNews();
});


class ExamsHandler {
  static createDatesTable(dates = []) {
    if (!dates?.length) return '';
    
    return dates
      .map(date => `
        <tr>
          <td class="p-3 border-b border-gray-200 bg-white text-gray-700 font-medium w-1/3">
            ${date.event}
          </td>
          <td class="p-3 border-b border-gray-200 bg-white text-gray-800">
            ${date.date}${date.note ? `<br><span class="text-sm text-gray-500 italic">${date.note}</span>` : ''}
          </td>
        </tr>
      `)
      .join("");
  }

  static processHighlights(highlights = []) {
    const processedHighlights = new Map();
    highlights.forEach(highlight => {
      if (!processedHighlights.has(highlight.particulars)) {
        processedHighlights.set(highlight.particulars, highlight.details);
      }
    });
    return processedHighlights;
  }

  static createHighlightsTable(highlights = []) {
    const processedHighlights = Array.from(this.processHighlights(highlights));
    return processedHighlights
      .map(([particulars, details]) => `
        <tr>
          <td class="p-3 border-b border-gray-200 bg-white text-gray-700 font-medium w-1/3">${particulars}</td>
          <td class="p-3 border-b border-gray-200 bg-white text-gray-800 whitespace-pre-line">${details}</td>
        </tr>
      `)
      .join("");
  }

  static openExamPopup(examData) {
    this.closeExamPopup();

    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50';
    popup.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div class="relative">
          <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold" 
                  onclick="ExamsHandler.closeExamPopup()">×</button>
          
          <div class="p-6">
            <!-- Header -->
            <div class="flex flex-col md:flex-row items-center gap-6 mb-6 border-b border-gray-200 pb-6">
              <img src="${examData.exam_logo.url}" 
                   alt="${examData.title}" 
                   class="w-24 h-24 object-contain bg-gray-50 rounded-lg p-2 border border-gray-200">
              <div class="text-center md:text-left">
                <h3 class="text-2xl font-bold text-gray-900">${examData.title}</h3>
                <p class="text-gray-600 mt-2">
                  <span class="font-medium">Exam Date:</span> ${new Date(examData.exam_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <!-- Details -->
            <div class="mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <p class="text-gray-800">
                    <span class="font-medium text-orange-800">Conducting Body:</span><br/>
                    ${examData.conducting_body}
                  </p>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <p class="text-gray-800">
                    <span class="font-medium text-orange-800">Official Website:</span><br/>
                    <a href="${examData.official_website}" class="text-blue-600 hover:text-blue-800 underline" target="_blank">
                      ${examData.official_website}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <!-- Highlights -->
            <div class="exam-popup-highlights">
              <h4 class="text-xl font-bold mb-4 text-gray-800">Exam Highlights</h4>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="w-full">
                  <tbody>
                    ${this.createHighlightsTable(examData.highlights)}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Important Dates -->
            <div class="mt-8">
              <h4 class="text-xl font-bold mb-4 text-gray-800">Important Dates</h4>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <table class="w-full">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="p-3 text-left font-bold text-gray-700">Event</th>
                      <th class="p-3 text-left font-bold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.createDatesTable(examData.important_dates)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    popup.addEventListener('click', (e) => {
      if (e.target === popup) this.closeExamPopup();
    });

    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
  }

  static closeExamPopup() {
    const popup = document.querySelector('.fixed.inset-0');
    if (popup) {
      popup.remove();
      document.body.style.overflow = 'auto';
    }
  }

  static handleCardClick(exam) {
    try {
      this.openExamPopup(exam);
    } catch (error) {
      console.error('Error handling card click:', error);
    }
  }

  static async init() {
    const container = document.querySelector('#exams-container');
    if (!container) return;

    try {
      container.innerHTML = `
        <div class="flex items-center justify-center p-8">
          <div class="animate-pulse flex items-center gap-3 text-gray-600">
            <svg class="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-lg font-medium">Loading exams...</span>
          </div>
        </div>
      `;
      
      const response = await fetch('exam-data.json');
      const data = await response.json();
      const exams = data.exams;
      
      if (!exams?.length) {
        throw new Error('No exams data received');
      }

      const examsHTML = exams.map(exam => {
        const safeExamData = JSON.stringify(exam).replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
          
        const examDate = new Date(exam.exam_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
        return `
          <div class="exam-card transform hover:scale-105 transition-all duration-300" 
               data-exam='${safeExamData}'>
            <div class="relative bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden h-full flex flex-col border border-gray-200">
              <!-- Top Gradient Banner -->
              <div class="h-16" style="background: linear-gradient(to right, #F3933B, rgba(243, 147, 59, 0.6));"></div>
              
              <!-- Logo Container -->
              <div class="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div class="w-24 h-24 bg-white rounded-xl shadow-md p-3 flex items-center justify-center border border-gray-200">
                  <img src="${exam.exam_logo.url}" 
                       alt="${exam.title}" 
                       class="w-20 h-20 object-contain" 
                       loading="lazy" 
                       onerror="this.src='fallback-image.png'"/>
                </div>
              </div>

              <!-- Content Container -->
              <div class="pt-16 p-6 flex flex-col flex-1">
                <!-- Title -->
                <h3 class="text-xl font-bold text-center text-gray-800 mb-3">${exam.title}</h3>
                
                <!-- Date Badge -->
                <div class="flex justify-center mb-6">
                  <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm font-medium">${examDate}</span>
                  </div>
                </div>

                <!-- Conducting Body -->
                <div class="mb-6 text-center">
                  <p class="text-sm text-gray-600">Conducting Body</p>
                  <p class="text-gray-800 font-medium">${exam.conducting_body}</p>
                </div>

                <!-- Action Button -->
                <div class="mt-auto">
                  <button class="w-full bg-gradient-to-r from-[#F3933B] to-orange-500 hover:from-orange-600 hover:to-orange-700 
                               text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 
                               transform hover:-translate-y-1 hover:shadow-lg">
                    <span class="flex items-center justify-center gap-2">
                      View Details
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 p-0">
          ${examsHTML}
        </div>
      `;

      // Add click handlers
      container.querySelectorAll('.exam-card').forEach(card => {
        card.addEventListener('click', () => {
          try {
            const examData = JSON.parse(card.dataset.exam);
            this.handleCardClick(examData);
          } catch (error) {
            console.error('Error parsing exam data:', error);
          }
        });
      });

    } catch (error) {
      console.error('Error initializing exams:', error);
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12">
          <div class="text-orange-600 mb-4">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <p class="text-lg font-semibold text-gray-800 mb-2">Failed to load exams</p>
          <p class="text-gray-600">Please try again later</p>
        </div>
      `;
    }
  }
}

// Add this to your HTML file
const styles = `
  <style>
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  </style>
`;

// Insert styles into document head
document.head.insertAdjacentHTML('beforeend', styles);

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
  ExamsHandler.init();
});


// Initialize all data loading
document.addEventListener("DOMContentLoaded", () => {
  // NotificationsHandler.loadNotifications();
  // ExamsHandler.loadExams();
  // CollegesHandler.loadColleges();
  FAQHandler.loadFAQs();
});
