
const onRouteUpdate = (location) => {
  if (window.ga) {
    window.ga('send', location.pathname);
  }
}

export {onRouteUpdate};
