// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "optionsmessagecard.h"
#include "omoricard.h"
#include "omoriradio.h"
#include <qapplication.h>
#include <qboxlayout.h>
#include <qlabel.h>

OptionsMessageCard::OptionsMessageCard() : OmoriCard(nullptr) {
    QFont appFont = QApplication::font();
    appFont.setPixelSize(36);

    QVBoxLayout *optionsLayout = new QVBoxLayout;
    optionsLayout->setSpacing(20);
    optionsLayout->setAlignment(Qt::AlignVCenter);

    QLabel *hangmanLabel = new QLabel(optionsMessage);
    hangmanLabel->setFont(appFont);

    QHBoxLayout *radioLayout = new QHBoxLayout;
    OmoriRadio *noButton = new OmoriRadio(u"Ne"_s);
    radioLayout->addWidget(noButton);
    OmoriRadio *yesButton = new OmoriRadio(u"Ano"_s);
    radioLayout->addWidget(yesButton);
    radioLayout->addStretch();
    radioLayout->setSpacing(20);

    optionsLayout->addWidget(hangmanLabel);
    optionsLayout->addLayout(radioLayout);

    setLayout(optionsLayout);
}
