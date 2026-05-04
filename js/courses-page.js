(function () {
  "use strict";
  const API = window.location.origin;
  const grid = document.getElementById("catalog-grid");
  if (grid) {
    let allCourses = [];
    let activeFilter = "All";
    async function loadCourses() {
      try {
        const res = await fetch(API + "/api/courses");
        allCourses = await res.json();
        renderCourses(allCourses);
      } catch (e) {
        allCourses = getStaticCourses();
        renderCourses(allCourses);
      }
    }
    function renderCourses(courses) {
      const info = document.getElementById("catalog-count");
      if (info)
        info.innerHTML =
          "Showing <strong>" + courses.length + "</strong> courses";
      if (courses.length === 0) {
        grid.innerHTML =
          '<div class="no-results"><div class="emoji">🔍</div><h3>No courses found</h3><p>Try a different search or filter.</p></div>';
        return;
      }
      grid.innerHTML = courses
        .map(function (c) {
          return (
            '<a href="course-detail.html?id=' +
            c.id +
            '" class="catalog-card">' +
            '<div class="catalog-card-top" style="background:' +
            c.gradient +
            '">' +
            '<span class="c-card-tag">' +
            (c.tag || "") +
            "</span>" +
            '<span class="c-card-emoji">' +
            (c.emoji || "📚") +
            "</span></div>" +
            '<div class="catalog-card-body"><h3>' +
            c.title +
            "</h3>" +
            "<p>" +
            c.description +
            "</p>" +
            '<div class="catalog-card-meta"><span>📖 ' +
            (c.lessons || 0) +
            " lessons</span>" +
            "<span>⏱️ " +
            (c.duration || "") +
            "</span>" +
            "<span>📊 " +
            (c.level || "") +
            "</span></div>" +
            '<div class="catalog-card-footer">' +
            '<span class="rating">⭐ ' +
            c.rating +
            " · " +
            Number(c.students).toLocaleString() +
            " students</span>" +
            '<span class="price">₹' +
            Number(c.price).toLocaleString() +
            "</span>" +
            "</div></div></a>"
          );
        })
        .join("");
    }
    var searchInput = document.getElementById("catalog-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = this.value.toLowerCase();
        var filtered = allCourses.filter(function (c) {
          return (
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
          );
        });
        if (activeFilter !== "All")
          filtered = filtered.filter(function (c) {
            return c.category === activeFilter;
          });
        renderCourses(filtered);
      });
    }
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        var q = searchInput ? searchInput.value.toLowerCase() : "";
        var filtered = allCourses;
        if (activeFilter !== "All")
          filtered = filtered.filter(function (c) {
            return c.category === activeFilter;
          });
        if (q)
          filtered = filtered.filter(function (c) {
            return (
              c.title.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q)
            );
          });
        renderCourses(filtered);
      });
    });
    loadCourses();
  }
  var detailEl = document.getElementById("course-detail-main");
  if (detailEl) {
    var params = new URLSearchParams(window.location.search);
    var courseId = params.get("id") || 1;
    async function loadDetail() {
      try {
        var res = await fetch(API + "/api/courses/" + courseId);
        var course = await res.json();
        fillDetail(course);
      } catch (e) {
        var courses = getStaticCourses();
        var found =
          courses.find(function (c) {
            return c.id == courseId;
          }) || courses[0];
        fillDetail(found);
      }
    }
    function fillDetail(c) {
      document.getElementById("cd-title").textContent = c.title;
      document.getElementById("cd-desc").textContent = c.description;
      document.getElementById("cd-price").textContent =
        "₹" + Number(c.price).toLocaleString();
      document.getElementById("cd-rating").textContent = "⭐ " + c.rating;
      document.getElementById("cd-students").textContent =
        Number(c.students).toLocaleString() + " students";
      document.getElementById("cd-duration").textContent =
        c.duration || "40 hours";
      document.getElementById("cd-lessons").textContent =
        (c.lessons || 80) + " lessons";
      document.getElementById("cd-level").textContent = c.level || "Beginner";
      document.getElementById("cd-instructor").textContent = c.instructor;
      var hero = document.getElementById("cd-hero");
      if (hero) hero.style.background = c.gradient;
      document.title = c.title + " — Seek2Learn";
    }
    loadDetail();
  }
  document.querySelectorAll(".module-header").forEach(function (h) {
    h.addEventListener("click", function () {
      h.classList.toggle("open");
      var content = h.nextElementSibling;
      content.classList.toggle("open");
    });
  });
  function getStaticCourses() {
    return [
      {
        id: 1,
        title: "UI/UX Design Masterclass",
        description:
          "Learn Figma, design systems, and user research to build products people love.",
        instructor: "Sarah Chen",
        price: 1499,
        rating: 4.9,
        students: 3200,
        category: "Design",
        tag: "Bestseller",
        gradient: "linear-gradient(135deg,#667eea,#764ba2)",
        emoji: "🎨",
        duration: "42 hours",
        lessons: 86,
        level: "Beginner",
      },
      {
        id: 2,
        title: "AI & Prompt Engineering",
        description:
          "Master ChatGPT, Claude, and Midjourney to supercharge your productivity.",
        instructor: "Rahul Verma",
        price: 1299,
        rating: 4.8,
        students: 5100,
        category: "Technology",
        tag: "Hot 🔥",
        gradient: "linear-gradient(135deg,#f7971e,#ffd200)",
        emoji: "🤖",
        duration: "28 hours",
        lessons: 54,
        level: "Intermediate",
      },
      {
        id: 3,
        title: "Full-Stack Web Development",
        description:
          "Go from zero to job-ready with HTML, CSS, JavaScript, React, and Node.js.",
        instructor: "Priya Sharma",
        price: 2199,
        rating: 4.9,
        students: 7800,
        category: "Development",
        tag: "New",
        gradient: "linear-gradient(135deg,#11998e,#38ef7d)",
        emoji: "💻",
        duration: "68 hours",
        lessons: 142,
        level: "Beginner",
      },
      {
        id: 4,
        title: "Data Analytics with Python",
        description:
          "Learn pandas, matplotlib, and SQL to turn raw data into business insights.",
        instructor: "Amit Patel",
        price: 1799,
        rating: 4.7,
        students: 4400,
        category: "Data Science",
        tag: "Popular",
        gradient: "linear-gradient(135deg,#e8604c,#ff9a8b)",
        emoji: "📊",
        duration: "36 hours",
        lessons: 78,
        level: "Intermediate",
      },
      {
        id: 5,
        title: "Mobile App Development",
        description:
          "Build iOS & Android apps using React Native with real projects.",
        instructor: "Neha Gupta",
        price: 1999,
        rating: 4.8,
        students: 2900,
        category: "Development",
        tag: "Trending",
        gradient: "linear-gradient(135deg,#4facfe,#00f2fe)",
        emoji: "📱",
        duration: "52 hours",
        lessons: 96,
        level: "Intermediate",
      },
      {
        id: 6,
        title: "Digital Marketing Strategy",
        description:
          "SEO, paid ads, email funnels, and analytics — the complete marketing toolkit.",
        instructor: "Vikram Singh",
        price: 999,
        rating: 4.6,
        students: 3600,
        category: "Marketing",
        tag: "Expert",
        gradient: "linear-gradient(135deg,#5b2e91,#9b59b6)",
        emoji: "🎯",
        duration: "32 hours",
        lessons: 64,
        level: "Beginner",
      },
      {
        id: 7,
        title: "Cloud Computing with AWS",
        description:
          "Master AWS services including EC2, S3, Lambda, and DynamoDB.",
        instructor: "Karthik Nair",
        price: 2499,
        rating: 4.8,
        students: 2100,
        category: "Technology",
        tag: "Advanced",
        gradient: "linear-gradient(135deg,#ff6b6b,#ee5a24)",
        emoji: "☁️",
        duration: "48 hours",
        lessons: 92,
        level: "Advanced",
      },
      {
        id: 8,
        title: "Cybersecurity Fundamentals",
        description:
          "Learn ethical hacking, network security, and incident response.",
        instructor: "Arjun Reddy",
        price: 1899,
        rating: 4.7,
        students: 1800,
        category: "Technology",
        tag: "In Demand",
        gradient: "linear-gradient(135deg,#2c3e50,#3498db)",
        emoji: "🔒",
        duration: "40 hours",
        lessons: 74,
        level: "Beginner",
      },
    ];
  }
})();
