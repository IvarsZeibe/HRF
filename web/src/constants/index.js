import { keyboard, voltage, target, numbers, facebook, instagram, linkedin, twitter} from "../assets";

export const url = 'https://localhost:5001/api/';

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "testing",
    title: "Testing",
  },
  {
    id: "controlPanel",
    title: "Control Panel",
  },
  {
    id: "profile",
    title: "My profile",
  },
  {
    id: "signIn",
    title: "Log In",
  },
  {
    id: "signOut",
    title: "Log Out",
  },
];

export const test = [
  {
    id: "WritingTest",
    name: "Typing Speed",
    img: keyboard,
  },
  {
    id: "ReactionTest",
    name: "Reaction Time",
    img: voltage,
  },
  {
    id: "AimTest",
    name: "Aim Trainer",
    img: target,
  },
  {
    id: "NumberMemoryTest",
    name: "Number Memory",
    img: numbers,
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Testing",
        link: "https://www.hrf.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hrf.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hrf.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hrf.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hrf.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hrfcom/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hrf.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hrf.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hrf.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hrf.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hrf.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hrf.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];