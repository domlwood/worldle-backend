const app = require("express")();
const haversine = require("haversine");
const map = require("rxjs/operators");

const PORT = process.env.PORT || 3000;
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://worldle-dwd.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/distance", (req, res) => {
  params = JSON.parse(req.query.distance);

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  function toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }
  function calcBearing(startLat, startLng, destLat, destLng) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);

    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
  }

  const start = {
    latitude: params[0].latitude,
    longitude: params[0].longitude,
  };
  const end = {
    latitude: params[1].latitude,
    longitude: params[1].longitude,
  };
  const distance = haversine(start, end);
  console.log(
    params[0].latitude,
    params[0].longitude,
    params[1].latitude,
    params[1].longitude
  );

  const bearing = calcBearing(
    params[0].latitude,
    params[0].longitude,
    params[1].latitude,
    params[1].longitude
  );

  res.status(200).send({
    distance: distance,
    bearing: bearing,
  });
});

app.listen(80, () => console.log(`it's alive on http://localhost:${PORT}`));
