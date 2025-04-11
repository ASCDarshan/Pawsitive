import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, get, set } from "firebase/database";
import { db, database, auth } from "../../../firebase";
import Googlemap from "../../GoogleMap/GoogleMap";

const PawPrintFrame = ({ themeColor = "lavender" }) => {
  return (
    <div className="absolute -inset-4 pointer-events-none z-0">
      {/* Top left paw */}
      <svg className={`absolute top-4 left-4 w-12 h-12 text-${themeColor}-200 transform rotate-45`} viewBox="0 0 100 100" fill="currentColor">
        <path d="M50,16c-7.7,0-14,6.3-14,14s6.3,14,14,14s14-6.3,14-14S57.7,16,50,16z M28,30c0-5.5,4.5-10,10-10s10,4.5,10,10s-4.5,10-10,10 S28,35.5,28,30z M62,50c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S62,45.5,62,50z M32,50c0,5.5-4.5,10-10,10s-10-4.5-10-10 s4.5-10,10-10S32,45.5,32,50z M72,30c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S72,24.5,72,30z" />
      </svg>
      
      {/* Top right paw */}
      <svg className={`absolute top-4 right-4 w-12 h-12 text-${themeColor}-200 transform -rotate-45`} viewBox="0 0 100 100" fill="currentColor">
        <path d="M50,16c-7.7,0-14,6.3-14,14s6.3,14,14,14s14-6.3,14-14S57.7,16,50,16z M28,30c0-5.5,4.5-10,10-10s10,4.5,10,10s-4.5,10-10,10 S28,35.5,28,30z M62,50c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S62,45.5,62,50z M32,50c0,5.5-4.5,10-10,10s-10-4.5-10-10 s4.5-10,10-10S32,45.5,32,50z M72,30c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S72,24.5,72,30z" />
      </svg>
      
      {/* Bottom left paw */}
      <svg className={`absolute bottom-4 left-4 w-12 h-12 text-${themeColor}-200 transform -rotate-45`} viewBox="0 0 100 100" fill="currentColor">
        <path d="M50,16c-7.7,0-14,6.3-14,14s6.3,14,14,14s14-6.3,14-14S57.7,16,50,16z M28,30c0-5.5,4.5-10,10-10s10,4.5,10,10s-4.5,10-10,10 S28,35.5,28,30z M62,50c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S62,45.5,62,50z M32,50c0,5.5-4.5,10-10,10s-10-4.5-10-10 s4.5-10,10-10S32,45.5,32,50z M72,30c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S72,24.5,72,30z" />
      </svg>
      
      {/* Bottom right paw */}
      <svg className={`absolute bottom-4 right-4 w-12 h-12 text-${themeColor}-200 transform rotate-45`} viewBox="0 0 100 100" fill="currentColor">
        <path d="M50,16c-7.7,0-14,6.3-14,14s6.3,14,14,14s14-6.3,14-14S57.7,16,50,16z M28,30c0-5.5,4.5-10,10-10s10,4.5,10,10s-4.5,10-10,10 S28,35.5,28,30z M62,50c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S62,45.5,62,50z M32,50c0,5.5-4.5,10-10,10s-10-4.5-10-10 s4.5-10,10-10S32,45.5,32,50z M72,30c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S72,24.5,72,30z" />
      </svg>
      
      {/* Decorative border */}
      <div className={`absolute inset-0 border-4 border-dashed border-${themeColor}-100 rounded-lg`}></div>
    </div>
  );
};

const ResourceDetail = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserAuthenticated(!!user);
    });
    
    return () => unsubscribe();
  }, []);

  const fetchResourceDetails = useCallback(async () => {
    if (!resourceId) {
      setError("No resource ID found.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching resource with ID:", resourceId);
      console.log("User authentication status:", userAuthenticated ? "Authenticated" : "Not authenticated");
      
      // FIRST: Try Realtime Database (where your permissions are set up correctly)
      try {
        // Try resources collection
        const resourceRef = ref(database, `resources/${resourceId}`);
        const snapshot = await get(resourceRef);
        
        if (snapshot.exists()) {
          console.log("Resource found in Realtime DB resources collection");
          setResource({
            ...snapshot.val(),
            id: resourceId
          });
          setLoading(false);
          return;
        }
        
        // Try webResources collection
        const webResourceRef = ref(database, `webResources/${resourceId}`);
        const webSnapshot = await get(webResourceRef);
        
        if (webSnapshot.exists()) {
          console.log("Resource found in Realtime DB webResources collection");
          setResource({
            ...webSnapshot.val(),
            id: resourceId
          });
          setLoading(false);
          return;
        }
        
        // Try all mock resources categories
        const mockCategories = [
          'dog_health', 'dog_nutrition', 'dog_supplies', 'dog_services', 'dog_information',
          'cat_health', 'cat_nutrition', 'cat_supplies', 'cat_services', 'cat_information'
        ];
        
        for (const category of mockCategories) {
          const mockRef = ref(database, `mockResources/${category}`);
          const mockCategorySnapshot = await get(mockRef);
          
          if (mockCategorySnapshot.exists()) {
            const mockResources = mockCategorySnapshot.val();
            if (mockResources[resourceId]) {
              console.log(`Resource found in mockResources/${category}`);
              setResource({
                ...mockResources[resourceId],
                id: resourceId,
                category: category
              });
              setLoading(false);
              return;
            }
          }
        }
        
        console.log("Resource not found in Realtime DB, trying Firestore");
      } catch (rtdbError) {
        console.warn("Error accessing Realtime Database:", rtdbError);
      }
      
      // SECOND: Try Firestore as fallback
      const resourceRef = doc(db, "resources", resourceId);
      const docSnap = await getDoc(resourceRef);
      
      if (docSnap.exists()) {
        console.log("Document data found in Firestore resources collection");
        setResource({
          ...docSnap.data(),
          id: resourceId
        });
      } else {
        // If not in Firestore resources, try webResources collection
        const webResourceRef = doc(db, "webResources", resourceId);
        const webDocSnap = await getDoc(webResourceRef);
        
        if (webDocSnap.exists()) {
          console.log("Web resource data found in Firestore webResources collection");
          setResource({
            ...webDocSnap.data(),
            id: resourceId
          });
        } else {
          // For resources from Google Maps (not stored in Firestore or Realtime DB)
          // We need to check if we have it in session storage
          try {
            const storedResources = sessionStorage.getItem('mapResources');
            
            if (storedResources) {
              const parsedResources = JSON.parse(storedResources);
              const foundResource = parsedResources.find(r => r.id === resourceId || r.place_id === resourceId);
              
              if (foundResource) {
                console.log("Found resource in session storage:", foundResource);
                setResource(foundResource);
                
                // Save to Realtime Database for future reference
                try {
                  const newResourceRef = ref(database, `resources/${resourceId}`);
                  await set(newResourceRef, {
                    ...foundResource,
                    createdAt: new Date().toISOString(),
                    source: 'google_maps'
                  });
                  console.log("Resource saved to Realtime Database for future use");
                } catch (saveError) {
                  console.warn("Could not save resource to Realtime Database:", saveError);
                  // Continue anyway since we have the resource from session storage
                }
              } else {
                throw new Error("Resource not found in session storage");
              }
            } else {
              throw new Error("No map resources in session storage");
            }
          } catch (storageError) {
            console.error("Session storage error:", storageError);
            setError("Resource not found. Please go back and try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
      setError(`Error fetching resource: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [resourceId, userAuthenticated]);

  useEffect(() => {
    fetchResourceDetails();
  }, [fetchResourceDetails]);

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };

  // Determine if this is a dog or cat resource
  const isPetType = (type) => {
    return resource?.category?.startsWith(type);
  };
  
  const isDogResource = isPetType('dog_');
  const isCatResource = isPetType('cat_');
  
  // Get theme color based on pet type
  const getThemeColor = () => {
    if (isDogResource) {
      return 'blue';
    } else if (isCatResource) {
      return 'amber';
    } else {
      return 'lavender';
    }
  };
  
  const themeColor = getThemeColor();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-lavender-50">
        <div className={`animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-${themeColor}-600`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-lavender-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 relative">
          <PawPrintFrame themeColor={themeColor} />
          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            
            {!userAuthenticated && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">You might need to sign in to view this resource.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
            
            <button
              onClick={() => navigate(-1)}
              className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white font-semibold py-2 px-6 rounded-full transition-colors`}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-lavender-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 relative">
          <PawPrintFrame themeColor={themeColor} />
          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resource Not Found</h2>
            <p className="text-gray-700 mb-6">The resource you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate(-1)}
              className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white font-semibold py-2 px-6 rounded-full transition-colors`}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center text-${themeColor}-600 hover:text-${themeColor}-800 transition-colors duration-300`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Resources
          </button>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
          <PawPrintFrame themeColor={themeColor} />
          
          {/* Header */}
          <div className={`bg-${themeColor}-600 text-white p-6 relative z-10`}>
            <h1 className="text-3xl font-bold mb-2">{resource.name}</h1>
            <p className="text-lg opacity-90">{resource.type || (isDogResource ? "Dog Resource" : isCatResource ? "Cat Resource" : "Pet Resource")}</p>
          </div>

          {/* Resource image */}
          {resource.photoUrl && (
            <div className="w-full h-64 overflow-hidden relative z-10">
              <img 
                src={resource.photoUrl} 
                alt={resource.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23999999'%3ENo Image Available%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          )}

          {/* Resource details */}
          <div className="p-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Information</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${themeColor}-500 mr-3 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-700">Address</p>
                      <p className="text-gray-600">{resource.address || resource.vicinity || "No address available"}</p>
                    </div>
                  </div>

                  {resource.phone && resource.phone !== "N/A" && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${themeColor}-500 mr-3 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-700">Phone</p>
                        <p className="text-gray-600">{resource.phone}</p>
                      </div>
                    </div>
                  )}

                  {resource.email && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${themeColor}-500 mr-3 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-700">Email</p>
                        <p className="text-gray-600">{resource.email}</p>
                      </div>
                    </div>
                  )}

                  {resource.website && resource.website !== "N/A" && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${themeColor}-500 mr-3 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-700">Website</p>
                        <a 
                          href={resource.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`text-${themeColor}-600 hover:underline break-words`}
                        >
                          {resource.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {(resource.hours && resource.hours !== "N/A") || resource.time ? (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${themeColor}-500 mr-3 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-700">Hours</p>
                        {resource.hours ? (
                          Array.isArray(resource.hours) ? (
                            <ul className="text-gray-600 space-y-1">
                              {resource.hours.map((day, index) => (
                                <li key={index}>{day}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600">{resource.hours}</p>
                          )
                        ) : resource.time ? (
                          <ul className="text-gray-600 space-y-1">
                            {resource.time.split(", ").map((day, index) => (
                              <li key={index}>{day}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {resource.rating > 0 && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${themeColor}-500 mr-3 mt-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-700">Rating</p>
                        <div className="flex items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 ${i < Math.round(resource.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">
                            {resource.rating.toFixed(1)} ({resource.userRatingsTotal || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
                <div className="h-64 rounded-lg overflow-hidden relative">
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <div className={`animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-${themeColor}-600`}></div>
                    </div>
                  )}
                  {resource.lat && resource.lng ? (
                    <Googlemap
                      center={{ lat: resource.lat, lng: resource.lng }}
                      resources={[resource]}
                      category={resource.category}
                      onMapLoaded={handleMapLoaded}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">No location data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {resource.description && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
                <div className={`bg-${themeColor}-50 p-4 rounded-lg`}>
                  <p className="text-gray-700">{resource.description}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {resource.lat && resource.lng && (
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${resource.lat},${resource.lng}`, '_blank')}
                  className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 flex items-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 1.586l-4 4V4a1 1 0 00-1-1H5a1 1 0 00-1 1v2.586l-.293-.293a1 1 0 10-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 10-1.414-1.414L12 7.586V1.586z" clipRule="evenodd" />
                  </svg>
                  Get Directions
                </button>
              )}
              
                {resource.phone && resource.phone !== "N/A" && (
                  <button 
                    onClick={() => window.open(`tel:${resource.phone}`, '_self')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Now
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    const shareData = {
                      title: resource.name,
                      text: `Check out this pet resource: ${resource.name} located at ${resource.address || resource.vicinity || "N/A"}.`,
                      url: window.location.href,
                    };
                    
                    if (navigator.share) {
                      navigator.share(shareData);
                    } else {
                      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                      alert("Resource information copied to clipboard!");
                    }
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ResourceDetail;