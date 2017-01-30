node index.js &
sleep 1
wget --mirror --page-requisites --no-parent localhost:3000/topology/index.html
cd localhost:3000/topology
cadaver https://research-edit.math.osu.edu/topology <<EOF
mput *
mput people/*
mput slides/*
mput css/*
mput img/*
mput js/*
mput javascripts/*
mput stylesheets/*
mkdir slides
mput slides/*
mkdir slides/afe7b2b0698686cfa888fe7d887549c0
mput slides/afe7b2b0698686cfa888fe7d887549c0/*
mkdir slides/afe7b2b0698686cfa888fe7d887549c0/images
mput slides/afe7b2b0698686cfa888fe7d887549c0/images/*
mkdir slides/trace-methods
mput slides/trace-methods/*
mkdir slides/trace-methods/images
mput slides/trace-methods/images/*
EOF
