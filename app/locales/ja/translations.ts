/* tslint:disable:object-literal-sort-keys max-line-length */

export default {
    general: {
        share: '共有',
        embed: '埋込み',
        download: 'ダウンロード',
        delete: '削除',
        view: '表示',
        edit: '編集',
        cancel: 'キャンセル',
        revisions: '修正',
        md5: 'MD5',
        date: '日付',
        sha2: 'SHA2',
    },
    quickfiles: {
        title: '{{user-name}}\'の クイックファイル',
        description: 'ここにアップロードされたファイルは<b>一般公開</b>されており、共有リンクを使用して他のユーザーと簡単に共有できます。',
        feedback_dialog_text: 'クイックファイルの考え方を我々に教えて下さい',
        transition_auth: 'クイックファイルを表示するには、ログインしている必要があります。ログインページにリダイレクトします。',
    },
    feedback: {
        button_text: 'フィードバック',
        placeholder: 'フィードバックをシェア',
        follow_up_label: 'OSFを改良するため、また機会があれば我々に連絡して下さい。',
        title: 'フィードバックの送信',
        confirm_button_text: '送信',
        thank_you: 'ありがとうございます',
        success: 'あなたからのフィードバックは提出されました',
        dismiss: '了解',
    },
    file_detail: {
        version: {
            id: 'バージョンID',
            title: '(バージョン: {{version-number}})',
        },
        embed: {
            dynamic: 'JavaScriptを用いたダイレクトレンダーiframe',
            direct: '高さと幅を固定したダイレクトiframe',
        },
        tags: 'タグ:',
        toggle: 'トグルビュー:',
        delete_file: {
            question: 'ファイルを削除しますか？',
            confirm: '本当に <b>{{file-name}}</b> を削除してもよろしいでしょうか？',
        },
        sha2_description: 'SHA-2は、データの完全性を検証するために使用されるNSAによって設計された暗号ハッシュ関数です。',
        md5_description: 'MD5は、データの完全性を検証するために使用されるアルゴリズムです。',
        // toast messages
        delete_success: 'ファイルが削除されました',
        delete_fail: 'エラー、ファイルを削除できません',
        save_success: 'ファイルが保存されました',
        save_fail: 'エラー、ファイルを保存できません',
    },
};
