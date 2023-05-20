import React from 'react'

import { AnchorButton, Intent, ProgressBar } from '@blueprintjs/core'

export default class DragAndDrop extends React.Component {
    constructor(props: any) {
        super(props)
        this.state = {
            loadedFiles: [],
        }
    }

    onFileLoad(e: any) {
        const file = e.currentTarget.files[0]
        const imageFormat = file.type
        const imageSize = file.size

        let fileReader = new FileReader()
        fileReader.onload = () => {
            const fileDTO = {
                data: fileReader.result,
                isUploading: false,
            }

            // Add file
            this.addLoadedFile(fileDTO)

            //@ts-ignore
            this.props.imageSubmitCallback(fileReader.result, imageFormat, imageSize)
        }

        fileReader.readAsDataURL(file)
    }

    addLoadedFile(file: any) {
        this.setState(() => ({
            //@ts-ignore
            loadedFiles: [file],
        }))
    }

    render() {
        //@ts-ignore
        const { loadedFiles } = this.state

        return (
            <div className="inner-container" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="sub-header">Drag an Image</div>
                <div className="draggable-container">
                    <input
                        accept="image/png, image/jpg, image/jpeg"
                        id="file-browser-input"
                        name="file-browser-input"
                        onChange={this.onFileLoad.bind(this)}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        // @ts-ignore
                        onDrop={this.onFileLoad.bind(this)}
                        //@ts-ignore
                        ref={(input) => (this.fileInput = input)}
                        //@ts-ignore
                        type="file"
                    />
                    <div className="files-preview-container">
                        {loadedFiles.map((file: any, idx: any) => {
                            return (
                                <div className="file" key={idx}>
                                    <img src={file.data} />
                                    <div className="container">
                                        <span className="progress-bar">{file.isUploading && <ProgressBar />}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="helper-text">Drag and Drop Images Here</div>
                    <div className="file-browser-container">
                        <AnchorButton
                            intent={Intent.PRIMARY}
                            minimal={true}
                            onClick={() =>
                                /*@ts-ignore*/
                                this.fileInput.click()
                            }
                            text="Browse"
                        />
                    </div>
                </div>
            </div>
        )
    }
}
