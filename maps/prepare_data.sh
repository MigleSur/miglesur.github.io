cd data

#wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip
#wget http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_populated_places.zip
#
#unzip ne_10m_populated*.zip
#unzip ne_10m_admin*.zip
#
#rm *.json

Rscript country_codes.R


topojson \
  -o custom.json \
  --id-property SU_A3 \
  --properties name=NAME \
  -- \
  countries.json \
  places.json
