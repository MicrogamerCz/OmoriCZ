// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "optionsmessagecard.h"
#include "omoricard.h"
#include "omoriradio.h"
#include <qapplication.h>
#include <qboxlayout.h>
#include <qlabel.h>
#include <qlayout.h>

OptionsMessageCard::OptionsMessageCard() : OmoriCard(nullptr) {
    QFont appFont = QApplication::font();
    appFont.setPixelSize(36);

    QVBoxLayout *optionsLayout = new QVBoxLayout;
    optionsLayout->setSpacing(20);
    optionsLayout->setAlignment(Qt::AlignVCenter);

    QLabel *hangmanLabel = new QLabel(optionsMessage);
    hangmanLabel->setWordWrap(true);
    hangmanLabel->setFont(appFont);

    QHBoxLayout *radioLayout = new QHBoxLayout;
    OmoriRadio *yesButton = new OmoriRadio(u"Ano"_s);
    radioLayout->addWidget(yesButton);

    OmoriRadio *noButton = new OmoriRadio(u"Ne"_s);
    noButton->setChecked(false);
    radioLayout->addWidget(noButton);

    radioLayout->addStretch();
    radioLayout->setSpacing(20);

    optionsLayout->addWidget(hangmanLabel);
    optionsLayout->addLayout(radioLayout);

    setLayout(optionsLayout);

    connect(this, &OptionsMessageCard::setMessage, [yesButton, noButton, this](const QString &text) {
        bool equalToSameMessage = text.compare(optionsMessage);
        yesButton->setVisible(!equalToSameMessage);
        noButton->setVisible(!equalToSameMessage);
    });
    connect(this, &OptionsMessageCard::setMessage, hangmanLabel, &QLabel::setText);
}

void OptionsMessageCard::resetMessage() {
    Q_EMIT setMessage(optionsMessage);
}
