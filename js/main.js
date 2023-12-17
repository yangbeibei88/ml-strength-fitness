const currentPage = window.location.pathname;
const queryStr = window.location.search;
const urlParams = new URLSearchParams(queryStr);
const pageBody = document.body;
const mobileSize = window.matchMedia("(max-width: 576px)");

function highlightActiveNavTab() {
  const navLinks = document.querySelectorAll(".nav-link");
  console.log(navLinks);
  navLinks.forEach((navLink) => {
    if (navLink.getAttribute("href") === currentPage) {
      navLink.classList.add("current-active");
    }
  });
}

/**
 * Fetch classes.json and parse to classes & class page
 */

async function fetchClassesData() {
  const classesRes = await fetch("../data/classes.json");
  const classesData = await classesRes.json();
  console.log(classesData);
  return classesData;
}

// display classes in html/classes.html page
async function displayClasses() {
  const classes = await fetchClassesData();

  const allClassList = document.querySelector(
    "#all-class-list .container .grid-4col"
  );

  classes.forEach((classObj) => {
    const classDiv = document.createElement("article");

    classDiv.classList.add("filterCategory");
    classDiv.setAttribute(
      "data-classCategory",
      classObj.class_category.toLowerCase()
    );
    classDiv.innerHTML = `
    <a
    href="../html/class.html?classid=${classObj.class_id}&classname=${
      classObj.class_name
    }"><img
      src=${classObj.class_thumbnail_path}
      alt=${classObj.class_name}
      class="class-card-image"></a>
  <div class="class-card-content">
    <div
      class="category-tag category-tag-${classObj.class_category.toLowerCase()}">
      ${classObj.class_category}</div>
    <a
      href="../html/class.html?id=${classObj.class_id}&${classObj.class_name}">
      <h5>${classObj.class_name}</h5>
    </a>
  </div>
    `;
    allClassList.appendChild(classDiv);
  });
  filterClasses();
  displayClassFilterResults();
}

// display popular classes in home page
async function displayPopularClasses() {
  const popularClassesGrid = document.querySelector(
    "#popular-classes .container .grid-4col"
  );

  const classes = await fetchClassesData();

  const popularClassesArr = ["bodyattack", "bodycombat", "bodypump", "zumba"];

  const popularClassesData = [];

  for (let i = 0; i < popularClassesArr.length; i++) {
    classes.forEach((classObj) => {
      if (
        classObj.class_name.toLowerCase().indexOf(popularClassesArr[i]) > -1
      ) {
        popularClassesData.push(classObj);
      }
    });
  }

  popularClassesData.forEach((classObj) => {
    const classCard = document.createElement("article");
    classCard.className = "class-card";
    classCard.innerHTML = `
    <a
    href="./html/class.html?classid=${classObj.class_id}&classname=${classObj.class_name}"><img
      src="${classObj.class_thumbnail_path}"
      alt="${classObj.class_name}"
      class="class-card-image"></a>
  <a
    href="./html/class.html?classid=${classObj.class_id}&classname=${classObj.class_name}">
    <h5>${classObj.class_name}</h5>
  </a>
    `;
    popularClassesGrid.appendChild(classCard);
  });

  console.log(popularClassesData);
}

async function displayClassDetails() {
  const currentClassId = urlParams.get("classid");
  const classes = await fetchClassesData();

  // filter out the class object's id is equal to url param id
  const currentClass = classes.filter(
    (classObj) => classObj.class_id == currentClassId
  )[0];
  console.log(currentClass);

  // populate class page title
  if (currentPage == "/html/class.html") {
    document.title = `${currentClass.class_name} - ML Strength`;
  }

  // class details page = header image and heading
  const classHeader = document.getElementById("class-detail-hero");

  const classHeaderBannerDiv = document.createElement("div");
  classHeaderBannerDiv.className = "page-header-banner-container";
  classHeaderBannerDiv.innerHTML = `
  <img
  src=${currentClass.class_header_path}
  alt=${currentClass.class_name}
  class="page-header-banner-bg-image">
<div
  class="page-header-banner-content-heading">
  <h1>${currentClass.class_name}</h1>
</div>
  `;
  classHeader.appendChild(classHeaderBannerDiv);

  // class aside nav title
  const classAsideH5 = document.querySelector("#class-detail-side-nav h5");
  classAsideH5.textContent = currentClass.class_name;

  // class details page - class detail info
  const classDetailInfo = document.getElementById("class-detail-info");
  const classDesc = classDetailInfo.querySelector(".class-description");
  const classBenefits = classDetailInfo.querySelector(".class-benefits");
  const classDuration = classDetailInfo.querySelector(".class-duration");
  const classBring = classDetailInfo.querySelector(".class-what-to-bring");

  // populate class description
  classDesc.innerHTML = `
  <h5>About The Class</h5>
  <p>${currentClass.class_description}</p>

  ${
    currentClass.class_video_src
      ? `<div class="iframe-container"><iframe 
  src=${currentClass.class_video_src}
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen></iframe></div>`
      : ""
  }


  `;

  // populate class benefits
  classBenefits.innerHTML = `
  <h5>Benefits</h5>
  <ul class="styled-list">${currentClass.class_benefits
    .filter((benefit) => benefit !== "")
    .map((benefit) => `<li>${benefit}</li>`)
    .join("")}</ul>
  `;

  // populate class duration
  classDuration.innerHTML = `
  <h5>Duration</h5>
  <p>${currentClass.class_duration
    .filter((duration) => duration !== "")
    .join(" / ")}</p>
  `;

  // populate class what to bring
  classBring.innerHTML = `
  <h5>What To Bring</h5>
  <ul class="styled-list">${currentClass.class_bring_items
    .filter((item) => item !== "")
    .map((item) => `<li>${item}</li>`)
    .join("")}</ul>
  `;
}

function filterClasses() {
  // get class categries and counts
  const allClassesDivs = Array.from(
    document.querySelectorAll(".filterCategory")
  );
  console.log(allClassesDivs);
  let classCats = [];
  let classCatCount = {};
  allClassesDivs.forEach((classDiv) => {
    const classCat = classDiv.getAttribute("data-classcategory");
    classCats.push(classCat);
  });
  classCatCount["all"] = classCats.length;
  classCats.forEach((cat) => {
    classCatCount[cat] ? (classCatCount[cat] += 1) : (classCatCount[cat] = 1);
  });

  console.log(classCats);
  console.log(classCatCount);
  console.log(Object.keys(classCatCount));

  // add category list to filter
  const classFilter = document.getElementById("classes-filter");
  Object.keys(classCatCount).forEach((cat) => {
    const catOption = document.createElement("option");
    catOption.value = cat;
    if (catOption.value === "all") {
      catOption.textContent = `All Classes (${classCatCount[cat]})`;
    } else {
      catOption.textContent = `${cat
        .charAt(0)
        .toUpperCase()
        .concat(cat.slice(1))} (${classCatCount[cat]})`;
    }
    classFilter.appendChild(catOption);
  });

  // get current selected category
  classFilter.addEventListener("change", () => {
    console.log(classFilter.value);
    urlParams.set("class-category", classFilter);
    location.search = `?class-category=${classFilter.value}`;
  });

  // if no urlparams, set default filter option to all
  urlParams.size === 0
    ? (classFilter.value = "all")
    : (classFilter.value = urlParams.get("class-category"));
}

function displayClassFilterResults() {
  const classCategoryParam = urlParams.get("class-category");
  if (classCategoryParam) {
    const classArr = Array.from(document.querySelectorAll(".filterCategory"));
    classArr.forEach((classCard) => {
      const dataClassCategory = classCard.getAttribute("data-classcategory");
      if (
        classCategoryParam === "all" ||
        dataClassCategory == classCategoryParam
      ) {
        classCard.parentElement.appendChild(classCard);
      } else {
        classCard.remove();
      }
    });
  }
}

/**
 * Fetch clubs.json and parse to clubs & club page
 */

// popular club card info in home page
async function fetchClubsData() {
  const clubsRes = await fetch("../data/clubs.json");
  const clubsData = await clubsRes.json();
  console.log(clubsData);
  return clubsData;
}

async function displayHomeClubs() {
  const clubs = await fetchClubsData();

  const homeClubsList = document.querySelector(
    "#find-local .container .grid-3col"
  );

  clubs.forEach((club) => {
    const clubCardDiv = document.createElement("div");
    clubCardDiv.classList.add("club-card");
    clubCardDiv.innerHTML = `
    <img
    src=${club.club_thumbnail_path}
    alt=${club.club_name}
    class="club-card-thumbnail">
  <div class="club-card-content">
    <h5>${club.club_name}</h5>
    <p class="address">${Object.values(club.club_location).join(" ")}
    </p>
    <a href="html/club.html?clubid=${club.club_id}&club=${club.club_name}"
      class="btn btn-small arrow-right">Club
      Details</a>
  </div>
    `;
    homeClubsList.appendChild(clubCardDiv);
  });
}

// display clubs in clubs page
async function displayClubs() {
  const clubs = await fetchClubsData();

  const clubsClubsList = document.querySelector("#clubs .location-list");

  clubs.forEach((club) => {
    const clubCardDiv = document.createElement("article");
    clubCardDiv.classList.add("club-location-card");
    clubCardDiv.setAttribute(
      "data-clubsuburb",
      club.club_location.club_suburb.toLowerCase()
    );
    clubCardDiv.setAttribute(
      "data-clubpostcode",
      club.club_location.club_postcode
    );
    clubCardDiv.innerHTML = `
    <h5>${club.club_name}</h5>
    <p class="address">${Object.values(club.club_location).join(" ")}</p>
    <a href="tel:${club.club_phone.match(/\d+/gi).join("")}" class="phone">${
      club.club_phone
    }</a>
    <a href="./club.html?clubid=${club.club_id}&club=${club.club_name}"
      class="btn btn-small arrow-right">Club Details</a>
    `;
    clubsClubsList.appendChild(clubCardDiv);
  });
}

// populate club info in club page
async function displayClubDetails() {
  const currentClubId = urlParams.get("clubid");
  const clubs = await fetchClubsData();

  // filter out the club object's id is equal to url param id
  const currentClub = clubs.filter(
    (clubObj) => clubObj.club_id == currentClubId
  )[0];
  console.log(currentClub);

  // populate club page title
  if (currentPage == "/html/club.html") {
    document.title = `${currentClub.club_name} - ML Strength`;
  }

  // club details page = header image and heading
  const clubHeader = document.getElementById("club-detail-hero");

  const clubHeaderBannerDiv = document.createElement("div");
  clubHeaderBannerDiv.className = "page-header-banner-container";
  clubHeaderBannerDiv.innerHTML = `
  <img
  src="${currentClub.club_banner_path}"
  alt="${currentClub.club_name}"
  class="page-header-banner-bg-image">
<div
  class="page-header-banner-content-heading">
  <h1>Welcome to ML Strength ${currentClub.club_name} 24/7 Club</h1>
</div>
  `;
  clubHeader.appendChild(clubHeaderBannerDiv);

  // club details page - club detail info
  const clubContactDetails = document.querySelector(
    "#club-contact .contact-info .club-contact-details"
  );
  clubContactDetails.innerHTML = `
  <h2>ML Strength - ${currentClub.club_name}</h2>
  <ul class="unstyled">
    <li class="address">${Object.values(currentClub.club_location).join(
      " "
    )}</li>
    <li class="phone"><a
        href="tel:${currentClub.club_phone.match(/\d+/gi).join("")}">${
    currentClub.club_phone
  }</a></li>
    <li class="email"><a
        href="mailto:${currentClub.club_email}">${currentClub.club_email}</a>
    </li>
    <li class="openhours">Accessible
      24/7</li>
  </ul>
  `;

  // club gallery
  const clubGallery = document.querySelector(".club-gallery-container");
  console.log(clubGallery);
  clubGallery.innerHTML = currentClub.club_galleryimage_path
    .filter((img) => img !== "")
    .map(
      (img) =>
        `<img src="${img}" alt="${img.split("/")[img.split("/").length - 1]}">`
    )
    .join("");
}

async function fetchTimetableData() {
  const timetableRes = await fetch("../data/timetable.json");
  const timetableData = await timetableRes.json();
  console.log(timetableData);
  return timetableData;
}

async function displayClubTimetable() {
  const currentClubId = urlParams.get("clubid");
  const timetableData = await fetchTimetableData();
  console.log(+currentClubId);
  const currentClubTimeTable = timetableData.filter(
    (cur) => cur.club_id === +currentClubId
  );
  console.log(currentClubTimeTable);

  const timetableSingleClubTbody = document.querySelector(
    "#timetable-single-club tbody"
  );
  currentClubTimeTable.forEach((classSessionObj) => {
    const classSessionRow = document.createElement("tr");
    classSessionRow.innerHTML = `
    <td data-classdate="${classSessionObj.date}"
    data-label="Date">
    <time
      datetime="${classSessionObj.date}">${classSessionObj.date}</time>
  </td>
  <td data-classtime="${classSessionObj.start_time}"
    data-label="Time"><time
      datetime="${classSessionObj.start_time}">${
      classSessionObj.start_time
    }</time> - <time
      datetime="${classSessionObj.end_time}">${classSessionObj.end_time}</time>
  </td>
  <td data-classduration="${classSessionObj.duration}"
    data-label="Duration">
    <time
      datetime="PT0H${classSessionObj.duration}M">${
      classSessionObj.duration
    }mins</time>
  </td>
  <td data-classtype="${classSessionObj.category.toLowerCase()}"
    data-label="Type">${classSessionObj.category}
  </td>
  <td data-classname="${classSessionObj.class.toLowerCase()}"
    data-label="Class">
    ${classSessionObj.class}</td>
  <td data-classdesc=""
    data-label="Description">
    ${classSessionObj.description}</td>
  <td data-trainer="${classSessionObj.trainer.toLowerCase()}"
    data-label="Trainer">${classSessionObj.trainer}</td>
    `;
    timetableSingleClubTbody.appendChild(classSessionRow);
  });

  clubTimetableFilterClasses();
}

async function displayClassTimetable() {
  const currentClassId = urlParams.get("classid");
  const timetableData = await fetchTimetableData();
  console.log(+currentClassId);
  const currentClassTimeTable = timetableData.filter(
    (cur) => cur.class_id === +currentClassId
  );
  console.log(currentClassTimeTable);

  const timetableSingleClassTbody = document.querySelector(
    "#timetable-single-class tbody"
  );

  currentClassTimeTable.forEach((classSessionObj) => {
    const classSessionRow = document.createElement("tr");
    classSessionRow.innerHTML = `
    <td data-classdate="${classSessionObj.date}"
    data-label="Date">
    <time
      datetime="${classSessionObj.date}">${classSessionObj.date}</time>
  </td>
  <td data-classtime="${classSessionObj.start_time}"
    data-label="Time"><time
      datetime="${classSessionObj.start_time}">${
      classSessionObj.start_time
    }</time> - <time
      datetime="${classSessionObj.end_time}">${classSessionObj.end_time}</time>
  </td>
  <td data-classduration="${classSessionObj.duration}"
    data-label="Duration">
    <time
      datetime="PT0H${classSessionObj.duration}M">${
      classSessionObj.duration
    }mins</time>
  </td>
  <td data-trainer="${classSessionObj.trainer.toLowerCase()}"
    data-label="Trainer">${classSessionObj.trainer}</td>
  <td data-clubname="${classSessionObj.club_name.toLowerCase()}"
    data-label="Club">${classSessionObj.club_name}</td>
    `;
    timetableSingleClassTbody.appendChild(classSessionRow);
  });

  classTimetableFilterClub();
}

function clubTimetableFilterClasses() {
  const timetableTbody = document.querySelector("#timetable-single-club tbody");
  const classSessionArr = Array.from(
    document.querySelectorAll("#timetable-single-club tbody tr")
  );

  const cellArr = Array.from(
    document.querySelectorAll("#timetable-single-club tbody td")
  );

  // filter out cells with classtype attribute
  const classTypeArr = cellArr.filter((cell) =>
    cell.hasAttribute("data-classtype")
  );
  let uniqueClassType = ["all"];
  classTypeArr.forEach((type) => {
    const classType = type.getAttribute("data-classtype");
    if (uniqueClassType.indexOf(classType) === -1) {
      uniqueClassType.push(classType);
    }
  });

  // add class type attribute to filter dropdown
  const classTypeDropdown = document.getElementById(
    "club-timetable-classes-filter-dropdown"
  );
  uniqueClassType.forEach((type) => {
    const typeOption = document.createElement("option");
    typeOption.value = type;
    typeOption.textContent =
      type === "all"
        ? "All Categories"
        : type.charAt(0).toUpperCase().concat(type.slice(1));
    classTypeDropdown.appendChild(typeOption);
  });

  // add event listner to class type dropdown
  classTypeDropdown.addEventListener("change", () => {
    const classTypeArr = cellArr.filter((cell) =>
      cell.hasAttribute("data-classtype")
    );
    const currentSelectedType = classTypeDropdown.value;
    classTypeArr.forEach((type) => {
      const classType = type.getAttribute("data-classtype");
      if (currentSelectedType === "all" || classType === currentSelectedType) {
        timetableTbody.appendChild(type.parentElement);
      } else {
        type.parentElement.remove();
      }
    });
    console.log(classTypeArr);
  });

  // add search class event listener
  const searchClassInput = document.getElementById(
    "club-timetable-search-class"
  );
  searchClassInput.addEventListener("input", (e) => {
    const inputText = e.target.value.toLowerCase();
    const classNameArr = cellArr.filter((cell) =>
      cell.hasAttribute("data-classname")
    );
    classNameArr.forEach((classNameTd) => {
      const className = classNameTd
        .getAttribute("data-classname")
        .toLowerCase();
      if (className.indexOf(inputText) !== -1 || inputText.length === 0) {
        timetableTbody.appendChild(classNameTd.parentElement);
      } else {
        classNameTd.parentElement.remove();
      }
    });
    console.log(classNameArr);
    console.log(inputText);
  });

  console.log(classSessionArr);
  console.log(classTypeArr);
  console.log(uniqueClassType);
}

function classTimetableFilterClub() {
  const timetableTbody = document.querySelector(
    "#timetable-single-class tbody"
  );
  const searchClubInput = document.getElementById(
    "class-timetable-search-club"
  );
  const cellArr = Array.from(
    document.querySelectorAll("#timetable-single-class tbody td")
  );

  searchClubInput.addEventListener("input", (e) => {
    const inputText = e.target.value.toLowerCase();
    const clubNameArr = cellArr.filter((cell) =>
      cell.hasAttribute("data-clubname")
    );
    clubNameArr.forEach((clubNameTd) => {
      const clubName = clubNameTd.getAttribute("data-clubname").toLowerCase();
      if (clubName.indexOf(inputText) !== -1 || inputText.length === 0) {
        timetableTbody.appendChild(clubNameTd.parentElement);
      } else {
        clubNameTd.parentElement.remove();
      }
    });
  });
}

/** CONTACT FORM VALIDATION */
function contactFormValidation() {
  const contactForm = document.getElementById("contact-form");
  const contactFormElements = contactForm.elements;
  const ffClublocation = contactForm.elements["club-location"];
  const ffFirstname = contactForm.elements["first-name"];
  const ffLastname = contactForm.elements["last-name"];
  const ffPhonenumber = contactForm.elements["phone-number"];
  const ffEmail = contactForm.elements["emailaddress"];
  const ffEnquirytype = contactForm.elements["enquiry-type"];
  const ffSubject = contactForm.elements["subject"];
  const ffMessage = contactForm.elements["message"];
  const ffPrivacy = contactForm.elements["agree-privacy-checkbox"];
  const ffMarketing = contactForm.elements["consent-marketing"];
  console.log(contactFormElements);
  // console.log(ffClublocation.tagName);
  // console.log(ffMessage.tagName);
  // console.log(ffMessage.getAttribute("maxlength"));
  // console.log(ffEmail.getAttribute("maxlength"));
  // console.log(ffFirstname.type);
  // console.log(ffPrivacy.type);

  function showError(input, message) {
    const formControl = input.parentElement.parentElement;
    formControl.classList.add("error");
    formControl.classList.remove("success");
    const errorMsgDiv = formControl.querySelector(".form-field-error");
    errorMsgDiv.textContent = message;
  }

  function showSuccess(input) {
    const formControl = input.parentElement.parentElement;
    formControl.classList.add("success");
    formControl.classList.remove("error");
  }

  function checkInputRequired(input) {
    if (input.hasAttribute("required")) {
      if (input.value.trim() === "") {
        showError(input, `${getFieldName(input)} is required`);
      } else {
        showSuccess(input);
      }
    }
  }

  function checkSelectRequired(select) {
    if (select.value === "") {
      showError(select, `Please select ${getFieldName(select)}`);
    } else {
      showSuccess(select);
    }
  }
  function checkCheckboxRequired(input) {
    if (!input.checked) {
      showError(input, `Please tick ${getFieldName(input)}`);
    } else {
      showSuccess(input);
    }
  }

  function checkEmail(input) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value)) {
      showSuccess(input);
    } else {
      showError(input, "Email is invalid");
    }
  }

  function checkPhonenumber(input) {
    const re = /^0[2-478]\d{8}$/;
    if (re.test(input.value)) {
      showSuccess(input);
    } else {
      showError(input, "Phone number is invalid");
    }
  }

  function checkInputLength(input) {
    const inputMinlength = +input.getAttribute("minlength");
    const inputMaxlength = +input.getAttribute("maxlength");
    if (input.hasAttribute("required") && input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
    } else if (
      inputMinlength > 0 &&
      input.value.trim().length < inputMinlength
    ) {
      showError(
        input,
        `${getFieldName(input)} must be at least ${inputMinlength} characters`
      );
    } else if (
      input.getAttribute("maxlength") > 0 &&
      input.value.trim().length > inputMaxlength
    ) {
      showError(
        input,
        `${getFieldName(input)} must be maximum ${inputMaxlength} characters`
      );
    } else {
      showSuccess(input);
    }
  }

  function getFieldName(formField) {
    return formField.id;
  }

  contactForm.addEventListener("submit", (e) => {
    for (let i = 0; i < contactFormElements.length - 1; i++) {
      const formEl = contactFormElements[i];
      if (
        (formEl.tagName === "INPUT" && formEl.type === "text") ||
        formEl.tagName === "TEXTAREA"
      ) {
        checkInputRequired(formEl);
        checkInputLength(formEl);
      } else if (formEl.tagName === "INPUT" && formEl.type === "checkbox") {
        checkCheckboxRequired(formEl);
      } else if (formEl.tagName === "SELECT") {
        checkSelectRequired(formEl);
      }
      checkEmail(ffEmail);
      checkPhonenumber(ffPhonenumber);

      if (!formEl.validity.valid) {
        e.preventDefault();
      }
    }
  });
}

// Help modal popup in contact page
function helpModal() {
  const helpLink = document.getElementById("helpLink");
  const helpModal = document.getElementById("help-modal");
  const closeBtn = document.getElementById("modal-close");

  // when hover over help link, pop up modal

  helpLink.addEventListener("mouseover", () =>
    setTimeout(() => (helpModal.style.display = "flex"), 800)
  );

  closeBtn.addEventListener("click", () => (helpModal.style.display = "none"));

  window.addEventListener("click", (e) => {
    if (e.target == helpModal) {
      helpModal.style.display = "none";
    }
  });
}

function appendNavBar() {
  navEl = document.createElement("nav");
  navEl.className = "navbar";
  navEl.id = "navbar";
  navEl.innerHTML = `
  <a href="/"><img src="/logo/logo.png"
  alt="logo" class="header-logo"></a>
<div class="navLinksContainer">
<ul id="navLinks">
  <li><a href="/html/clubs.html" class="nav-link">Clubs</a>
  </li>
  <li><a
      href="/html/classes.html" class="nav-link">Classes</a>
  </li>
  <li><a href="/html/about.html" class="nav-link">About</a>
  </li>
  <li><a
      href="/html/contact.html" class="nav-link">Contact</a>
  </li>
</ul>
</div>
<button
class="mobile-nav-menu navbar-hamburger-toggler"
type="button"
aria-label="navigation-toggler"
id="mobile-nav-toggler"></button>
  `;

  pageBody.insertAdjacentElement("afterbegin", navEl);
  console.log("Navbar inserted!");
}

function appendFooter() {
  footerEl = document.createElement("footer");
  footerEl.className = "bg-slateBlue text-white";
  footerEl.innerHTML = `<p>ML Strength</p>
  <p>Powered by Beibei Yang (474326484)</p>
  <p>Copyright &copy; 2023. All Rights Reserved
  </p>
  <div class="flex-center">
    <p>
      <a
        href="http://jigsaw.w3.org/css-validator/check/referer">
        <img
          style="border:0;width:88px;height:31px"
          src="http://jigsaw.w3.org/css-validator/images/vcss"
          alt="Valid CSS!" />
      </a>
    </p>
    <p>
      <a
        href="http://jigsaw.w3.org/css-validator/check/referer">
        <img
          style="border:0;width:88px;height:31px"
          src="http://jigsaw.w3.org/css-validator/images/vcss-blue"
          alt="Valid CSS!" />
      </a>
    </p>
    <a href="https://www.w3.org/WAI/WCAG2AA-Conformance"
      title="Explanation of WCAG 2 Level AA conformance">
      <img height="32" width="88"
        src="https://www.w3.org/WAI/wcag2AA"
        alt="Level AA conformance, W3C WAI Web Content Accessibility Guidelines 2.0">
    </a>
  </div>`;

  pageBody.appendChild(footerEl);
  console.log("Footer inserted!");
}

/** mobile hamburger menu */
function mobileMenu() {
  const mobileNavToggler = document.getElementById("mobile-nav-toggler");
  const navLinks = document.getElementById("navLinks");
  mobileNavToggler.addEventListener("click", () => {
    if (navLinks.style.display === "flex") {
      navLinks.style.display = "none";
      mobileNavToggler.classList.remove("navbar-hamburger-close");
      mobileNavToggler.classList.add("navbar-hamburger-toggler");
    } else {
      navLinks.style.display = "flex";
      mobileNavToggler.classList.remove("navbar-hamburger-toggler");
      mobileNavToggler.classList.add("navbar-hamburger-close");
    }
  });
}

function init() {
  appendNavBar();
  highlightActiveNavTab();
  switch (currentPage) {
    case "/":
    case "/index.html":
      displayHomeClubs();
      displayPopularClasses();
      break;
    case "/html/clubs.html":
    case "/html/clubs":
      displayClubs();
      break;
    case "/html/club.html":
      displayClubDetails();
      displayClubTimetable();
      break;
    case "/html/classes.html":
    case "/html/classes":
      displayClasses();
      break;
    case "/html/class.html":
      displayClassDetails();
      displayClassTimetable();
      break;
    case "/html/contact.html":
    case "/html/contact":
      contactFormValidation();
      helpModal();
      break;
  }
  appendFooter();
}

document.addEventListener("DOMContentLoaded", init);
if (mobileSize.matches) {
  document.addEventListener("DOMContentLoaded", mobileMenu);
}
