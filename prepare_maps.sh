#wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip
#wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_populated_places.zip
#
#unzip ne_10m_populated*.zip
#unzip ne_10m_admin*.zip
#
#rm *.json

Rscript country_codes.R


topojson \
  -o maps/custom.json \
  --id-property WB_A2  \
  --properties name=NAME \
  -- \
  maps/countries.json \
