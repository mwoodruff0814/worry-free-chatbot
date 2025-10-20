// FILE: src/constants/config.js
// PURPOSE: Central configuration for all API keys and settings

export const CONFIG = {
  baseAddress: "11715 Mahoning Avenue, North Jackson, OH 44451",
  phone: "330-435-8686",
  email: "service@worryfreemovers.com",
  bookingUrl: "https://worryfreemovers.com/moving/local",
  acuityUrl: "https://app.acuityscheduling.com/schedule.php?owner=26866067&ref=embedded_csp",
  
  // Google Maps Configuration
  googleMapsApiKey: "AIzaSyAWGIVnh7-2sgDJin_2qgNvwh4JD9UgJDo",
  
  // FormSubmit Configuration
  formSubmitUrl: "https://formsubmit.co/ajax/service@worryfreemovers.com",
  additionalEmail: "bwdrff1990@gmail.com,zlarimer24@gmail.com",
  
  // Cloudinary Configuration
  cloudinary: {
    cloudName: "dhiukpg4d",
    uploadPreset: "moving_estimates",
    apiUrl: "https://api.cloudinary.com/v1_1/dhiukpg4d/image/upload",
    folder: "moving_estimates"
  },

  // Square Payment Configuration
  square: {
    applicationId: "sq0idp-7GJn4RN8zcdsw3S1kJaNOA",
    accessToken: "EAAAlrQlot7DrT6h8D_9iRN1ZTAu_HzrfUyffHhcWxU1XTZkn4inHELSj6kBdEUS",
    environment: "production", // "sandbox" or "production"
    locationId: "L6WP06SMJKJSB" // Worry-Free Moving (Main) - 11715 Mahoning Avenue
  },

  // RingCentral SMS Configuration
  ringCentral: {
    clientId: "ZfNZYTGQfR4cCYu1vugV6l",
    clientSecret: "4zPHtLi6abHdk2BgRx8wH32tCCQ55rYbOcGAY1b8A4dl",
    jwt: "eyJraWQiOiI4NzYyZjU5OGQwNTk0NGRiODZiZjVjYTk3ODA0NzYwOCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJodHRwczovL3BsYXRmb3JtLnJpbmdjZW50cmFsLmNvbS9yZXN0YXBpL29hdXRoL3Rva2VuIiwic3ViIjoiOTA3NTUxMDQ4IiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5yaW5nY2VudHJhbC5jb20iLCJleHAiOjM5MDg0MDk2ODEsImlhdCI6MTc2MDkyNjAzNCwianRpIjoidGJGU2cyWGFSU3lkZVp3NFhoV3JNdyJ9.OXtJ8Q_DQm83dt5iHI3yTHAkSIsshsJ7gPttmJVEeNYZlzCCbvFgnJL-bZD3R8ze5KJ2kNG3pu3B2AX7gQznQ5hucQjHHhLlBDEzF_sLc4k-NA4VH375GCqF_h07iNQJJe-3I_qJI9__B0Umn8Uw75aWfBnS08iq6Hrim9cvYdmxk_XvXssfH7agDvL3-Q2G41TAlgFQvRCCAS8JRNENRtK9O20TEjzuvHVQPZZYFqXuoYXNbFxOJfFh9gg0eoEAxF4vQTB_XqXDAkf9_9yk4YKjeAVjPNwTrknDVUWJss_-CLGsTFd8jpDqGKDOGOEaHnNol0pURXlUfR_TIeC8Cw",
    businessPhone: "+13304358686",
    server: "https://platform.ringcentral.com"
  },
  
  // Upload limits
  maxPhotos: 5,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  autoSubmitTimeout: 30000, // 30 seconds
  
  // Session storage
  storageKey: "wfm_chat_session",
  sessionExpiry: 24 * 60 * 60 * 1000 // 24 hours
};