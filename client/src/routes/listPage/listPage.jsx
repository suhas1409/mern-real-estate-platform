// src/routes/listPage/ListPage.jsx
import React, { Suspense, useState } from "react";
import "./listPage.scss";
import { Await, useLoaderData } from "react-router-dom";
import { Filter } from "../../components/filter/Filter";
import { Card } from "../../components/card/Card";
import { Map } from "../../components/map/Map";

export const ListPage = () => {
  const data = useLoaderData();
  const [view, setView] = useState("list");

  return (
    <div className="listPage">
      {/* MOBILE AND TABLET VIEW SWITCHER */}
      <div className="viewSwitcher">
        <button
          className={
            view === "list" ? "active" : ""
          }
          onClick={() => setView("list")}
        >
          Property List
        </button>

        <button
          className={
            view === "map" ? "active" : ""
          }
          onClick={() => setView("map")}
        >
          Map
        </button>
      </div>

      {/* LEFT SIDE */}
      <div
        className={`listContainer ${
          view === "map" ? "hideResponsive" : ""
        }`}
      >
        <div className="wrapper">
          <Filter />

          {/* PROPERTY LIST */}
          <Suspense fallback={<p>Loading properties...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading properties!</p>}
            >
              {(postResponse) =>
                postResponse.data.length > 0 ? (
                  postResponse.data.map((post) => (
                    <Card
                      key={post.id}
                      item={post}
                    />
                  ))
                ) : (
                  <p>No properties found.</p>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>

      {/* DESKTOP MAP */}
      <div className="desktopMap">
        <Suspense fallback={<p>Loading map...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading map!</p>}
          >
            {(postResponse) => (
              <Map items={postResponse.data} />
            )}
          </Await>
        </Suspense>
      </div>

      {/* MOBILE AND TABLET MAP */}
      {view === "map" && (
        <div className="responsiveMap">
          <Suspense fallback={<p>Loading map...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading map!</p>}
            >
              {(postResponse) => (
                <Map
                  key="responsive-map"
                  items={postResponse.data}
                />
              )}
            </Await>
          </Suspense>
        </div>
      )}
    </div>
  );
}