import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase";

const PORTFOLIO_FIELDS = [
  "about",
  "name",
  "title",
  "profilePic",
  "work",
  "education",
  "skills",
  "contact",
  "customization",
  "customSlug",
  "published",
  "publishedAt"
];

const USER_FIELDS_TO_PRESERVE = [
  "tier",
  "email",
  "displayName",
  "photoURL",
  "premiumActivatedAt",
  "createdAt",
  "updatedAt"
];

const USER_METADATA_FIELDS = [
  "customSlug",
  "published",
  "publishedAt"
];

const pickFields = (source = {}, fields = []) =>
  fields.reduce((result, field) => {
    if (source[field] !== undefined) {
      result[field] = source[field];
    }
    return result;
  }, {});

export const extractPortfolioData = (docData = {}) => {
  const nestedPortfolio =
    docData.portfolio && typeof docData.portfolio === "object"
      ? docData.portfolio
      : null;
  const source = nestedPortfolio || docData;

  return pickFields(source, PORTFOLIO_FIELDS);
};

export const hasPortfolioData = (docData = {}) =>
  Object.keys(extractPortfolioData(docData)).length > 0;

export const loadPortfolioForUser = async (uid) => {
  const portfolioRef = doc(db, "portfolios", uid);
  const portfolioSnap = await getDoc(portfolioRef);

  if (portfolioSnap.exists()) {
    return extractPortfolioData(portfolioSnap.data());
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists() && hasPortfolioData(userSnap.data())) {
    return extractPortfolioData(userSnap.data());
  }

  return null;
};

export const savePortfolioForUser = async (uid, dataToSave, userData = {}) => {
  const cleanData = JSON.parse(JSON.stringify(dataToSave));
  const preservedUserFields = pickFields(userData, USER_FIELDS_TO_PRESERVE);
  const userMetadata = pickFields(cleanData, USER_METADATA_FIELDS);
  const userRef = doc(db, "users", uid);

  await setDoc(doc(db, "portfolios", uid), cleanData, { merge: true });
  await setDoc(
    userRef,
    {
      ...preservedUserFields,
      ...userMetadata
    },
    { merge: true }
  );
  await updateDoc(userRef, {
    about: deleteField(),
    name: deleteField(),
    title: deleteField(),
    profilePic: deleteField(),
    work: deleteField(),
    education: deleteField(),
    skills: deleteField(),
    contact: deleteField(),
    customization: deleteField(),
    portfolio: deleteField()
  });

  return cleanData;
};

export const loadPublicPortfolioBySlug = async (slug) => {
  const portfolioQuery = query(
    collection(db, "portfolios"),
    where("customSlug", "==", slug),
    where("published", "==", true)
  );
  const portfolioQuerySnapshot = await getDocs(portfolioQuery);

  if (!portfolioQuerySnapshot.empty) {
    return extractPortfolioData(portfolioQuerySnapshot.docs[0].data());
  }

  return null;
};
