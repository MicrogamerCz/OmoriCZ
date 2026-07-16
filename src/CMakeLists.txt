# SPDX-License-Identifier: BSD-2-Clause
# SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

# Target: static library
add_library(omopatch_static STATIC
  installer.cpp
  omoricard.cpp
  omoriradio.cpp
  omoributton.cpp
  omoriprogressbar.cpp
  optionsmessagecard.cpp
  fadeoverlay.cpp
)

target_compile_options (omopatch_static PUBLIC -fexceptions -Wno-undef)

target_link_libraries(omopatch_static PUBLIC Qt6::Network Qt6::Widgets QuaZip::QuaZip)
target_include_directories(omopatch_static PUBLIC ${CMAKE_BINARY_DIR})

qt_add_executable(omopatch main.cpp)
qt_add_resources(omopatch "assets"
  PREFIX "/"
  FILES contents/OMORI_GAME2.ttf
  FILES contents/omori.png
  FILES contents/radio.png
  FILES contents/progress/a1.png
  FILES contents/progress/a2.png
  FILES contents/progress/a3.png
  FILES contents/progress/a4.png
  FILES contents/progress/a5.png
  FILES contents/progress/a6.png
  FILES contents/progress/a7.png
  FILES contents/progress/a8.png
  FILES contents/progress/a9.png
  FILES contents/progress/a10.png
  FILES contents/progress/b1.png
  FILES contents/progress/b2.png
  FILES contents/progress/b3.png
  FILES contents/progress/b4.png
  FILES contents/progress/b5.png
  FILES contents/progress/b6.png
  FILES contents/progress/b7.png
  FILES contents/progress/b8.png
  FILES contents/progress/b9.png
  FILES contents/progress/b10.png
)

target_link_libraries(omopatch PRIVATE omopatch_static)
install(TARGETS omopatch ${KDE_INSTALL_TARGETS_DEFAULT_ARGS})
