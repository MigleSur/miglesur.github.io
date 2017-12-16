I=1
HEADER=""

for I in $(seq -f "%03g" 1 114)
do
  HEADER=${HEADER}"PC"$I","
done

# Remove the last coma
HEADER=${HEADER::-1}
echo $HEADER > demo
cat hands_pca.csv >> demo 
mv demo hands_pca.csv

I=1
HEADERX=""
HEADERY=""

for I in $(seq -f "%02g" 1 57)
do
  HEADERX=${HEADERX}"X"$I","
  HEADERY=${HEADERY}"Y"$I","
done

HEADER=${HEADERX}${HEADERY}
HEADER=${HEADER::-1}

echo $HEADER > demo
cat hands.csv >> demo 
mv demo hands.csv
