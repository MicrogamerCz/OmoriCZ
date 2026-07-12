/*
    SPDX-License-Identifier: GPL-2.0-or-later
    SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>
*/

#include "omoributton.h"
#include "omoricard.h"
#include "omoriradio.h"
#include <QPushButton>
#include <QtGlobal>
#include <qboxlayout.h>
#include <qcolor.h>
#include <qfont.h>
#include <qfontinfo.h>
#include <qinputmethod.h>
#include <qkeysequence.h>
#include <qlabel.h>
#include <qmargins.h>
#include <qnamespace.h>
#include <qobject.h>
#include <qpalette.h>
#include <qsize.h>
#include <qsizepolicy.h>
#include <qwidget.h>
#include <qwindow.h>
#ifdef Q_OS_ANDROID
#include <QGuiApplication>
#else
#include <QApplication>
#endif

#include <KAboutData>
#include <KLocalizedContext>
#include <KLocalizedString>
#include <QFont>
#include <QFontDatabase>
#include <QIcon>
#include <QLabel>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>
#include <QShortcut>
#include <QSizePolicy>
#include <QStackedLayout>
#include <QStringLiteral>
#include <QUrl>
#include <QVBoxLayout>
#include <QWidget>
#include <QWindow>

#include "omoricard.h"
// #include "version-omopatch.h"
// #include "omopatchconfig.h"

using namespace Qt::Literals::StringLiterals;

#ifdef Q_OS_ANDROID
Q_DECL_EXPORT
#endif
int main(int argc, char *argv[]) {
#ifdef Q_OS_ANDROID
    QGuiApplication app(argc, argv);
#else
    QApplication app(argc, argv);
#endif

    QFontDatabase::addApplicationFont(u":/contents/OMORI_GAME2.ttf"_s);
    app.setFont(QFont(QFontDatabase::applicationFontFamilies(0)));

    QPalette omoriPalette;
    omoriPalette.setColor(QPalette::Window, Qt::white);
    omoriPalette.setColor(QPalette::WindowText, Qt::white);

    QWidget window(nullptr, Qt::FramelessWindowHint);
    window.setPalette(omoriPalette);
    window.setFixedSize(800, 420);
    int padding = 5;
    window.setContentsMargins(padding, padding, padding, padding);

    OmoriCard headerCard;
    QVBoxLayout headerLayout(&headerCard);
    QLabel header(u"INSTALACE ČESKÉ LOKALIZACE OMORI"_s);
    headerLayout.addWidget(&header);
    header.setAlignment(Qt::AlignCenter);
    QFont headerFont = header.font();
    headerFont.setPixelSize(42);
    header.setFont(headerFont);

    OmoriCard optionsCard;
    QVBoxLayout hangmanOptionLayout;
    QLabel hangmanLabel(u"Vytvořit zálohu savů?"_s);
    headerFont.setPixelSize(36);
    hangmanLabel.setFont(headerFont);
    QHBoxLayout radioLayout;
    OmoriRadio noButton(u"Ne"_s);
    OmoriRadio yesButton(u"Ano"_s);
    radioLayout.addWidget(&noButton);
    radioLayout.addWidget(&yesButton);
    radioLayout.addStretch();
    radioLayout.setSpacing(20);
    hangmanOptionLayout.addWidget(&hangmanLabel);
    hangmanOptionLayout.addLayout(&radioLayout);
    hangmanOptionLayout.setSpacing(20);
    hangmanOptionLayout.setAlignment(Qt::AlignVCenter);
    optionsCard.setLayout(&hangmanOptionLayout);

    OmoriCard installCard;
    QHBoxLayout buttonsLayout;
    buttonsLayout.setSpacing(30);
    OmoriButton installButton(u"Nainstalovat"_s);
    OmoriButton closeButton(u"Zavřít"_s);
    buttonsLayout.addWidget(&installButton);
    buttonsLayout.addWidget(&closeButton);
    buttonsLayout.addStretch();
    installCard.setLayout(&buttonsLayout);

    QVBoxLayout layout;
    // layout.addLayout(&headerContainer, 1);
    layout.addWidget(&headerCard);
    layout.addWidget(&optionsCard, 1);
    layout.addWidget(&installCard);

    window.setLayout(&layout);
    window.show();
    return app.exec();

#ifdef Q_OS_WINDOWS
    if (AttachConsole(ATTACH_PARENT_PROCESS)) {
        freopen("CONOUT$", "w", stdout);
        freopen("CONOUT$", "w", stderr);
    }

    auto font = app.font(); // TODO: change for app-wide font
    font.setPointSize(10);
    app.setFont(font);
#endif

    KLocalizedString::setApplicationDomain("omopatch");
    QCoreApplication::setOrganizationName(u"KDE"_s);

    KAboutData aboutData(
        // The program name used internally.
        u"omopatch"_s,
        // A displayable program name string.
        i18nc("@title", "Omopatch"),
        // The program version string.
        QStringLiteral("0.0.1"),
        // Short description of what the app does.
        i18n("Application Description"),
        // The license this code is released under.
        KAboutLicense::GPL,
        // Copyright Statement.
        i18n("(c) 2026"));
    aboutData.addAuthor(i18nc("@info:credit", "Micro"), i18nc("@info:credit", "Maintainer"), u"microgamercz@proton.me"_s, u"https://yourwebsite.com"_s);
    aboutData.setTranslator(i18nc("NAME OF TRANSLATORS", "Your names"), i18nc("EMAIL OF TRANSLATORS", "Your emails"));
    KAboutData::setApplicationData(aboutData);
    QGuiApplication::setWindowIcon(QIcon::fromTheme(u"org.kde.omopatch"_s));

    QQmlApplicationEngine engine;

    engine.rootContext()->setContextObject(new KLocalizedContext(&engine));
    engine.loadFromModule("org.kde.omopatch", u"Main");

    if (engine.rootObjects().isEmpty()) {
        return -1;
    }

    return app.exec();
}
