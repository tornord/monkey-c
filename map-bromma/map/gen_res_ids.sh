#!/bin/zsh

# Create r.txt with 64 bitmap entries
for i in {0..63}; do
  echo "<bitmap id=\"m$i\" filename=\"m/$i.png\"><palette disableTransparency=\"true\"><color>000000</color><color>FFFFFF</color></palette></bitmap>" >> r.txt
done

# Build a comma-separated list of m0..m63 and write to rs.txt
VarRes=""
for i in {0..63}; do
  VarRes="$VarRes,m$i"
done

echo "${VarRes:1}" > rs.txt

# Optional pause (simulate Windows "pause")
read -s "?Press Enter to continue..."
