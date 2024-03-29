import React, { useState, useEffect, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import FallbackSpinner from './components/FallbackSpinner';
import NotFound from './components/NotFound';
import NavBarWithRouter from './components/NavBar';
import Home from './components/Home';
import endpoints from './constants/endpoints';

function MainApp() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(endpoints.routes, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err);
  }, []);

  return (
    <div className="MainApp">
      <NavBarWithRouter />
      <main className="main">
        <Suspense fallback={<FallbackSpinner />}>
          <Switch>
            <Route exact path="/" component={Home} />
            {data && data.sections.map((route) => {
              const SectionComponent = React.lazy(() => import('./components/' + route.component));
              return (
                <Route
                  key={route.headerTitle}
                  path={route.path}
                  component={SectionComponent} // Directly pass the component
                />
              );
            })}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
    </div>
  );
}

export default MainApp;
