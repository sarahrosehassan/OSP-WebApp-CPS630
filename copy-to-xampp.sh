#!/bin/zsh
# Copy the entire project folder to XAMPP htdocs for easy testing

# Change these paths if your XAMPP install is in a different location
SRC_DIR="$(pwd)"
DEST_DIR="/Applications/XAMPP/xamppfiles/htdocs/osp"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Copy all project files and folders (excluding node_modules and .git)
rsync -av --exclude='.git' --exclude='node_modules' "$SRC_DIR/" "$DEST_DIR/"

echo "Project copied to $DEST_DIR. You can now test with XAMPP!"
