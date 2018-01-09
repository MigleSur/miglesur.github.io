cd data

#wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_map_subunits.zip
#wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_populated_places.zip

#unzip ne_10m_populated*.zip
#unzip ne_10m_admin*.zip

rm *.json

ogr2ogr -f GeoJSON -where "ADM0_A3 IN ('ESP', 'DEU', 'FRA', 'DNK')" subunits.json ne_10m_admin_0_map_subunits.shp
ogr2ogr -f GeoJSON -where "ISO_A2 IN ('ES', 'DE', 'FR', 'DK') AND SCALERANK < 8" places.json  ne_10m_populated_places.shp

topojson \
  -o custom.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  subunits.json \
  places.json
