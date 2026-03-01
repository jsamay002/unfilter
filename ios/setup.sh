#!/bin/bash
set -e

echo "╔══════════════════════════════════════════╗"
echo "║       Unfilter — iOS Project Setup       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Install it first:"
    echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Install XcodeGen if needed
if ! command -v xcodegen &> /dev/null; then
    echo "📦 Installing XcodeGen..."
    brew install xcodegen
else
    echo "✅ XcodeGen already installed"
fi

# Generate Xcode project
echo "🔨 Generating Xcode project..."
cd "$(dirname "$0")"
xcodegen generate

echo ""
echo "✅ Project generated! Opening in Xcode..."
open Unfilter.xcodeproj

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Next steps:                             ║"
echo "║  1. Select your Development Team         ║"
echo "║  2. Select an iPhone simulator           ║"
echo "║  3. Hit ⌘R to build and run              ║"
echo "║                                          ║"
echo "║  The Distortion Lab tab is fully          ║"
echo "║  functional — pick a photo and try       ║"
echo "║  the smoothing slider.                   ║"
echo "╚══════════════════════════════════════════╝"
