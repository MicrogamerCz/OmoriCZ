// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "fadeoverlay.h"
#include "installer.h"
#include "omoributton.h"
#include "omoricard.h"
#include "omoriprogressbar.h"
#include "optionsmessagecard.h"
#include <QApplication>
#include <QFontDatabase>
#include <QLabel>
#include <QStackedLayout>
#include <QVBoxLayout>
#include <cmath>
#include <pthread.h>
#include <qapplication.h>
#include <qboxlayout.h>
#include <qobject.h>
#include <qstackedlayout.h>
#include <qwidget.h>

using namespace Qt::Literals::StringLiterals;

void setWidgetFontSize(QWidget &widget, QFont &font, int size) {
    font.setPixelSize(size);
    widget.setFont(font);
}

int main(int argc, char *argv[]) {
    Q_INIT_RESOURCE(assets);
    QApplication app(argc, argv);
    app.setWindowIcon(QIcon(u":/contents/omori.png"_s));

    Installer installer;

    QFontDatabase::addApplicationFont(u":/contents/OMORI_GAME2.ttf"_s);
    QFont omoriFont(QFontDatabase::applicationFontFamilies(0));
    app.setFont(omoriFont);

    QPalette omoriPalette;
    omoriPalette.setColor(QPalette::Window, Qt::white);
    omoriPalette.setColor(QPalette::WindowText, Qt::white);

    QWidget window(nullptr, Qt::FramelessWindowHint); // TODO: qt-layer-shell (for linux)
    window.setPalette(omoriPalette);
    window.setFixedSize(800, 420);
    int padding = 5;
    window.setContentsMargins(padding, padding, padding, padding);

    OmoriCard headerCard;
    QVBoxLayout headerLayout(&headerCard);
    QLabel header(u"INSTALACE ČESKÉ LOKALIZACE OMORI"_s);
    headerLayout.addWidget(&header);
    header.setAlignment(Qt::AlignCenter);
    setWidgetFontSize(header, omoriFont, 42);

    OptionsMessageCard optionsMessageCard;

    OmoriCard installCard;
    QHBoxLayout buttonsLayout;
    buttonsLayout.setSpacing(30);
    OmoriButton installButton(u"Nainstalovat"_s);
    OmoriButton closeButton(u"Zavřít"_s);
    buttonsLayout.addWidget(&installButton);
    buttonsLayout.addWidget(&closeButton);
    buttonsLayout.addStretch();
    installCard.setLayout(&buttonsLayout);

    OmoriProgressBar progressBar;
    progressBar.setVisible(false);
    buttonsLayout.addWidget(&progressBar, 1);

    QVBoxLayout *layout = new QVBoxLayout;
    layout->addWidget(&headerCard);
    layout->addWidget(&optionsMessageCard, 1);
    layout->addWidget(&installCard);

    FadeOverlay overlay;
    overlay.setVisible(false);

    QWidget *layoutContainer = new QWidget;
    layoutContainer->setLayout(layout);
    QStackedLayout stackLayout;
    stackLayout.setStackingMode(QStackedLayout::StackAll);
    stackLayout.addWidget(layoutContainer);
    stackLayout.addWidget(&overlay);

    QObject::connect(&overlay, &FadeOverlay::fadeFinished, &app, &QApplication::quit);
    QObject::connect(&installer, &Installer::finishedInstall, [&overlay] {
        overlay.setVisible(true);
    });
    QObject::connect(&installer, &Installer::progressChanged, &progressBar, &OmoriProgressBar::setValue);
    QObject::connect(&installer, &Installer::messageChanged, &optionsMessageCard, &OptionsMessageCard::setMessage);
    QObject::connect(&installer, &Installer::installingChanged, &progressBar, &OmoriProgressBar::setVisible);
    QObject::connect(&installer, &Installer::installingChanged, &installCard, &OmoriCard::setInnerFrame);
    QObject::connect(&installer, &Installer::installingChanged, [&installButton, &closeButton, &optionsMessageCard](bool installing) {
        installButton.setVisible(!installing);
        closeButton.setVisible(!installing);

        if (!installing)
            optionsMessageCard.resetMessage();
    });
    QObject::connect(&installButton, &OmoriButton::clicked, &installer, &Installer::beginSetup);
    QObject::connect(&closeButton, &OmoriButton::clicked, &app, &QApplication::exit);

    window.setLayout(&stackLayout);
    window.show();
    return app.exec();
}
